from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CSRDriveViewSet, DrivePhaseViewSet, DriveStatsView

router = DefaultRouter()
router.register(r'drives', CSRDriveViewSet, basename='drive')
router.register(r'phases', DrivePhaseViewSet, basename='phase')

urlpatterns = [
    path('stats/', DriveStatsView.as_view(), name='drive-stats'),
    path('', include(router.urls)),
]
