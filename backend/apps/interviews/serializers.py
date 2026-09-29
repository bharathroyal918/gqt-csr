from rest_framework import serializers
from .models import InterviewRound, InterviewSchedule, EvaluationRubric
from apps.students.serializers import StudentSerializer

class EvaluationRubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRubric
        fields = '__all__'

class InterviewScheduleSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    rubric = EvaluationRubricSerializer(read_only=True)

    class Meta:
        model = InterviewSchedule
        fields = '__all__'

class InterviewRoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewRound
        fields = '__all__'
