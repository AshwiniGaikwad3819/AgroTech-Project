from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'price', 'available_quantity', 'is_active')
    list_filter = ('product_type', 'category', 'is_active')
    search_fields = ('title', 'owner__username')
    autocomplete_fields = ('owner', 'category')
