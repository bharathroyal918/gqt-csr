from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamQuestionViewSet, ExamSessionViewSet, SubmitExamView

router = DefaultRouter()
router.register(r'questions', ExamQuestionViewSet, basename='exam-question')
router.register(r'sessions', ExamSessionViewSet, basename='exam-session')

urlpatterns = [
    path('submit/', SubmitExamView.as_view(), name='exam-submit'),
    path('', include(router.urls)),
]
