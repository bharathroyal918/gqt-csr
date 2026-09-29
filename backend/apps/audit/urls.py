from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, HealthCheckView

router = DefaultRouter()
router.register(r'logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='backend-health'),
    path('', include(router.urls)),
]
