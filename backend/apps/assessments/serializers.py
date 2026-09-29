from rest_framework import serializers
from .models import ExamQuestion, ExamSession, ExamResponse

class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        fields = '__all__'

class ExamResponseSerializer(serializers.ModelSerializer):
    question_details = ExamQuestionSerializer(source='question', read_only=True)

    class Meta:
        model = ExamResponse
        fields = '__all__'

class ExamSessionSerializer(serializers.ModelSerializer):
    responses = ExamResponseSerializer(many=True, read_only=True)

    class Meta:
        model = ExamSession
        fields = '__all__'
