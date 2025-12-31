from decimal import Decimal

from django.conf import settings
from django.db import models

from orders.models import Order


class Payment(models.Model):
    class Providers(models.TextChoices):
        PAYPAL = 'PAYPAL', 'PayPal (Dummy)'
        COD = 'COD', 'Cash on Delivery'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    provider = models.CharField(max_length=20, choices=Providers.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    reference = models.CharField(max_length=100, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f'Payment #{self.pk} - {self.status}'

    def mark_success(self, reference: str):
        self.status = self.Status.SUCCESS
        self.reference = reference
        self.order.status = Order.Status.PAID
        self.order.save(update_fields=['status'])
        self.save(update_fields=['status', 'reference'])
