from rest_framework import permissions, viewsets

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Payment.objects.select_related('order', 'buyer')
        if user.role == 'ADMIN':
            return queryset
        return queryset.filter(buyer=user)
