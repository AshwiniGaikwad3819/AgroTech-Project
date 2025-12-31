from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Product

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon']


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'available_quantity',
            'unit',
            'location',
            'product_type',
            'thumbnail',
            'is_active',
            'created_at',
            'updated_at',
            'category',
            'category_name',
            'owner',
        ]
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def get_owner(self, obj):
        return {
            'id': obj.owner_id,
            'name': obj.owner.get_full_name() or obj.owner.username,
            'role': obj.owner.role,
            'phone': obj.owner.phone,
        }

    def validate(self, attrs):
        request = self.context.get('request')
        user: User = request.user if request else None

        if request and request.method in ('POST', 'PUT', 'PATCH'):
            if not user or not user.is_authenticated:
                raise serializers.ValidationError('Authentication required.')
            if getattr(user, 'role', '').upper() != 'ADMIN':
                raise serializers.ValidationError('Only admin accounts can create or modify products.')

        return attrs

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)








