from rest_framework import serializers
from .models import CSRDrive, DrivePhase, CollegeDriveAllocation

class DrivePhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrivePhase
        fields = '__all__'

class CollegeDriveAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeDriveAllocation
        fields = '__all__'

class CSRDriveSerializer(serializers.ModelSerializer):
    phases = DrivePhaseSerializer(many=True, read_only=True)
    allocations = CollegeDriveAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = CSRDrive
        fields = '__all__'
