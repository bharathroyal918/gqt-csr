from rest_framework import serializers
from .models import College, Student

class CollegeSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(source='students.count', read_only=True)

    class Meta:
        model = College
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    college_details = CollegeSerializer(source='college', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
