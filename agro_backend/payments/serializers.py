import uuid

from rest_framework import serializers

from orders.models import Order

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = Payment
        fields = [
            'id',
            'order',
            'amount',
            'provider',
            'status',
            'reference',
            'payload',
            'created_at',
        ]
        read_only_fields = ('id', 'status', 'reference', 'payload', 'created_at')

    def create(self, validated_data):
        request = self.context['request']
        order = validated_data['order']
        validated_data['buyer'] = request.user
        validated_data['amount'] = order.total_amount
        validated_data.setdefault('provider', Payment.Providers.PAYPAL)
        validated_data['payload'] = {'message': 'Dummy PayPal transaction'}

        payment = Payment.objects.create(**validated_data)
        payment.status = Payment.Status.SUCCESS
        payment.reference = f'DUMMY-{uuid.uuid4().hex[:8].upper()}'
        payment.order.status = Order.Status.PAID
        payment.order.save(update_fields=['status', 'updated_at'])
        payment.order.add_tracking(
            request.user, Order.Status.PAID, 'Payment received via dummy PayPal'
        )
        payment.save(update_fields=['status', 'reference'])
        return payment



