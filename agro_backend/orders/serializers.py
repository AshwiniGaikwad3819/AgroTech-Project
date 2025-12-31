from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from products.models import Product
from products.serializers import ProductSerializer

from .models import Order, OrderItem, OrderTracking


class OrderItemSerializer(serializers.ModelSerializer):
  product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
  product_detail = ProductSerializer(source='product', read_only=True)
  subtotal = serializers.SerializerMethodField()

  class Meta:
    model = OrderItem
    fields = [
      'id',
      'product',
      'product_detail',
      'quantity',
      'unit_price',
      'subtotal',
    ]
    read_only_fields = ('id', 'unit_price', 'subtotal')

  def get_subtotal(self, obj):
    return obj.subtotal


class OrderTrackingSerializer(serializers.ModelSerializer):
  actor = serializers.SerializerMethodField()

  class Meta:
    model = OrderTracking
    fields = ['id', 'status', 'note', 'actor', 'created_at']

  def get_actor(self, obj):
    if obj.actor:
      return {
        'id': obj.actor_id,
        'name': obj.actor.get_full_name() or obj.actor.username,
        'role': obj.actor.role,
      }
    return None


class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True)
  buyer = serializers.SerializerMethodField()
  tracking = OrderTrackingSerializer(many=True, read_only=True)

  class Meta:
    model = Order
    fields = [
      'id',
      'buyer',
      'status',
      'shipping_address',
      'contact_phone',
      'notes',
      'total_amount',
      'created_at',
      'updated_at',
      'items',
      'tracking',
    ]
  read_only_fields = ('id', 'buyer', 'total_amount', 'created_at', 'updated_at')

  def get_buyer(self, obj):
    return {
      'id': obj.buyer_id,
      'name': obj.buyer.get_full_name() or obj.buyer.username,
      'phone': obj.buyer.phone,
      'role': obj.buyer.role,
    }

  def validate_items(self, items):
    if not items:
      raise serializers.ValidationError('At least one product is required.')
    for item in items:
      product: Product = item['product']
      if item['quantity'] > product.available_quantity:
        raise serializers.ValidationError(
          f"Insufficient stock for {product.title}. Available: {product.available_quantity}"
        )
    return items

  @transaction.atomic
  def create(self, validated_data):
    items_data = validated_data.pop('items', [])
    request = self.context['request']
    if getattr(request.user, 'role', '').upper() != 'USER':
      raise serializers.ValidationError('Only user accounts can place orders.')
    order = Order.objects.create(buyer=request.user, **validated_data)
    total = Decimal('0')

    for item_data in items_data:
      product = item_data['product']
      quantity = item_data['quantity']
      unit_price = product.price
      OrderItem.objects.create(
        order=order,
        product=product,
        quantity=quantity,
        unit_price=unit_price,
        supplier=product.owner,
      )
      product.available_quantity -= quantity
      product.save(update_fields=['available_quantity'])
      total += unit_price * quantity

    order.total_amount = total
    order.save(update_fields=['total_amount'])
    order.add_tracking(request.user, Order.Status.CREATED, 'Order placed')
    return order

  def update(self, instance, validated_data):
    # only allow status/notes updates
    instance.status = validated_data.get('status', instance.status)
    instance.notes = validated_data.get('notes', instance.notes)
    instance.save(update_fields=['status', 'notes', 'updated_at'])
    return instance

