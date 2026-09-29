from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterviewRoundViewSet, InterviewScheduleViewSet, EvaluationRubricViewSet

router = DefaultRouter()
router.register(r'rounds', InterviewRoundViewSet, basename='interview-round')
router.register(r'schedules', InterviewScheduleViewSet, basename='interview-schedule')
router.register(r'evaluations', EvaluationRubricViewSet, basename='interview-evaluation')

urlpatterns = [
    path('', include(router.urls)),
]
