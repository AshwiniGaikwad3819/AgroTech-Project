from django.db.models import Count, Sum
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer, OrderTrackingSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(user, 'role', '')
        queryset = (
            Order.objects.select_related('buyer')
            .prefetch_related(
                'items__product',
                'items__product__category',
                # removed supplier prefetch to align with two-role system
                'tracking',
                'tracking__actor',
            )
            .order_by('-created_at')
        )
        if role == 'ADMIN':
            return queryset
        return queryset.filter(buyer=user)

    def _user_can_manage(self, order, user):
        role = getattr(user, 'role', '')
        if role == 'ADMIN':
            return True
        return False

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.PAID:
            raise ValidationError('Only paid orders can be accepted.')
        if not self._user_can_manage(order, request.user):
            raise PermissionDenied('You are not allowed to accept this order.')
        order.status = Order.Status.IN_PROGRESS
        order.save(update_fields=['status', 'updated_at'])
        order.add_tracking(request.user, Order.Status.IN_PROGRESS, 'Order accepted for processing')
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        order = self.get_object()
        if not self._user_can_manage(order, request.user):
            raise PermissionDenied('Only admins can update fulfillment.')
        order.status = Order.Status.COMPLETED
        order.save(update_fields=['status', 'updated_at'])
        order.add_tracking(request.user, Order.Status.COMPLETED, 'Order marked as completed')
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='tracking')
    def add_tracking(self, request, pk=None):
        order = self.get_object()
        if not self._user_can_manage(order, request.user):
            raise PermissionDenied('You cannot update this order.')
        note = (request.data.get('note') or '').strip()
        status = request.data.get('status') or order.status
        if status not in Order.Status.values:
            raise ValidationError('Invalid status supplied.')
        if status != order.status:
            order.status = status
            order.save(update_fields=['status', 'updated_at'])
        order.add_tracking(request.user, status, note or 'Status updated')
        serializer = OrderTrackingSerializer(order.tracking.order_by('created_at'), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        aggregates = queryset.aggregate(
            total_sales=Sum('total_amount'),
            orders_count=Count('id'),
        )
        status_data = queryset.values('status').annotate(total=Count('id'))
        status_breakdown = {row['status']: row['total'] for row in status_data}
        return Response(
            {
                'orders': aggregates['orders_count'] or 0,
                'total_sales': aggregates['total_sales'] or 0,
                'status_breakdown': status_breakdown,
            }
        )
