from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'role',
        'is_active',
    )
    list_filter = ('role', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            'Agro Store Profile',
            {
                'fields': (
                    'role',
                    'phone',
                    'address_line',
                    'city',
                    'state',
                    'pin_code',
                )
            },
        ),
    )
