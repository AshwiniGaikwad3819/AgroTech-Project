from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AgroTokenObtainPairView,
    CurrentUserView,
    DashboardStatsView,
    RegisterView,
    UserListView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', AgroTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]






