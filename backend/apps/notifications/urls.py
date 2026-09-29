from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, DispatchNotificationView

router = DefaultRouter()
router.register(r'alerts', NotificationViewSet, basename='notification')

urlpatterns = [
    path('dispatch/', DispatchNotificationView.as_view(), name='notification-dispatch'),
    path('', include(router.urls)),
]
