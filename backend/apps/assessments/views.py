from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .models import ExamQuestion, ExamSession, ExamResponse
from .serializers import ExamQuestionSerializer, ExamSessionSerializer

class ExamQuestionViewSet(viewsets.ModelViewSet):
    queryset = ExamQuestion.objects.filter(is_active=True).order_by('id')
    serializer_class = ExamQuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset

class ExamSessionViewSet(viewsets.ModelViewSet):
    queryset = ExamSession.objects.all().order_by('-start_time')
    serializer_class = ExamSessionSerializer
    permission_classes = [AllowAny]

class SubmitExamView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_id = request.data.get('session_id')
        responses_data = request.data.get('responses', [])

        session = ExamSession.objects.filter(id=session_id).first()
        if not session:
            return Response({"error": "Exam session not found"}, status=status.HTTP_404_NOT_FOUND)

        total_score = 0.0
        max_score = 0.0

        for item in responses_data:
            q_id = item.get('question_id')
            selected = item.get('selected_option')
            time_spent = item.get('time_spent', 0)

            question = ExamQuestion.objects.filter(question_id=q_id).first()
            if question:
                max_score += float(question.marks)
                is_corr = (selected == question.correct_answer)
                if is_corr:
                    total_score += float(question.marks)
                else:
                    total_score -= float(question.negative_marks)

                ExamResponse.objects.create(
                    session=session,
                    question=question,
                    selected_option=selected,
                    is_correct=is_corr,
                    time_spent_seconds=time_spent
                )

        pct = (total_score / max_score * 100) if max_score > 0 else 0
        passed = pct >= 60.0

        session.total_score = max(0.0, total_score)
        session.percentage = round(pct, 2)
        session.passed = passed
        session.status = 'Completed'
        session.end_time = timezone.now()
        session.save()

        # Update student record
        student = session.student
        if passed:
            student.status = 'Qualified'
            student.current_round = 'Technical Interview'
        else:
            student.status = 'Rejected'
        student.save()

        return Response({
            "message": "Exam submitted successfully",
            "score": session.total_score,
            "percentage": session.percentage,
            "passed": session.passed,
            "status": session.status
        })
