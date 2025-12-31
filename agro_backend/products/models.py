from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Optional icon name for UI use.')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name


class Product(models.Model):
    class ProductTypes(models.TextChoices):
        INPUT = 'INPUT', 'Input Supply'
        PRODUCE = 'PRODUCE', 'Farm Produce'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products'
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    available_quantity = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=20, default='kg')
    location = models.CharField(max_length=150, blank=True)
    product_type = models.CharField(max_length=20, choices=ProductTypes.choices)
    thumbnail = models.ImageField(upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.title

    @property
    def is_available(self):
        return self.is_active and self.available_quantity > 0

# Create your models here.
