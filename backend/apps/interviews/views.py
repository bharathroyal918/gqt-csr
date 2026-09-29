from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import InterviewRound, InterviewSchedule, EvaluationRubric
from .serializers import InterviewRoundSerializer, InterviewScheduleSerializer, EvaluationRubricSerializer

class InterviewRoundViewSet(viewsets.ModelViewSet):
    queryset = InterviewRound.objects.all().order_by('round_number')
    serializer_class = InterviewRoundSerializer
    permission_classes = [AllowAny]

class InterviewScheduleViewSet(viewsets.ModelViewSet):
    queryset = InterviewSchedule.objects.all().order_by('interview_date', 'start_time')
    serializer_class = InterviewScheduleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        date_param = self.request.query_params.get('date')
        if status_param:
            queryset = queryset.filter(status=status_param)
        if date_param:
            queryset = queryset.filter(interview_date=date_param)
        return queryset

class EvaluationRubricViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubric.objects.all().order_by('-evaluated_at')
    serializer_class = EvaluationRubricSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        schedule = instance.interview
        schedule.status = 'Completed'
        schedule.save()

        student = schedule.student
        if instance.final_decision == 'Select':
            student.status = 'Selected'
        elif instance.final_decision == 'Reject':
            student.status = 'Rejected'
        student.save()
