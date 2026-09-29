from rest_framework import serializers
from .models import OfferLetter
from apps.students.serializers import StudentSerializer

class OfferLetterSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)

    class Meta:
        model = OfferLetter
        fields = '__all__'
