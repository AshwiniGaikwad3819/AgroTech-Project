from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from users.permissions import IsAdmin

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = (
            Product.objects.select_related('category', 'owner')
            .filter(is_active=True)
            .order_by('-created_at')
        )

        product_type = self.request.query_params.get('type')
        category = self.request.query_params.get('category')
        owner = self.request.query_params.get('owner')

        if product_type:
            queryset = queryset.filter(product_type=product_type.upper())
        if category:
            queryset = queryset.filter(category_id=category)
        if owner:
            queryset = queryset.filter(owner_id=owner)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        user_role = getattr(self.request.user, 'role', '')
        if self.request.user != serializer.instance.owner and user_role != 'ADMIN':
            raise PermissionDenied('Only owners or admins can update this product.')
        serializer.save()

    def perform_destroy(self, instance):
        user_role = getattr(self.request.user, 'role', '')
        if self.request.user != instance.owner and user_role != 'ADMIN':
            raise PermissionDenied('Only owners or admins can delete this product.')
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        queryset = Product.objects.filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.IsAuthenticated, IsAdmin],
        url_path='admin/all',
    )
    def admin_list(self, request):
        queryset = Product.objects.all().order_by('-created_at')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
