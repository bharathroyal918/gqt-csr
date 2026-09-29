from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeViewSet, StudentViewSet, StudentStatsView

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('stats/', StudentStatsView.as_view(), name='student-stats'),
    path('', include(router.urls)),
]
