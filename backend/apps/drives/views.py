from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import CSRDrive, DrivePhase, CollegeDriveAllocation
from .serializers import CSRDriveSerializer, DrivePhaseSerializer, CollegeDriveAllocationSerializer

from apps.students.models import College

class CSRDriveViewSet(viewsets.ModelViewSet):
    queryset = CSRDrive.objects.all().order_by('-created_at')
    serializer_class = CSRDriveSerializer
    permission_classes = [AllowAny]

class DrivePhaseViewSet(viewsets.ModelViewSet):
    queryset = DrivePhase.objects.all().order_by('phase_number')
    serializer_class = DrivePhaseSerializer
    permission_classes = [AllowAny]

class DriveStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_drives = CSRDrive.objects.count()
        active_drives = CSRDrive.objects.filter(status__in=['Registration', 'Assessment', 'Interview']).count()
        completed_drives = CSRDrive.objects.filter(status='Completed').count()

        # Dynamic calculation of districts reached across colleges & allocations
        college_districts = set(
            College.objects.exclude(district__isnull=True)
            .exclude(district__exact='')
            .values_list('district', flat=True)
        )
        allocation_districts = set(
            CollegeDriveAllocation.objects.exclude(district__isnull=True)
            .exclude(district__exact='')
            .values_list('district', flat=True)
        )
        all_districts = college_districts.union(allocation_districts)
        districts_reached = len(all_districts)
        total_karnataka_districts = 31
        coverage_pct = round((districts_reached / total_karnataka_districts) * 100, 1) if total_karnataka_districts > 0 else 0.0

        return Response({
            "total_drives": total_drives,
            "active_drives": active_drives,
            "completed_drives": completed_drives,
            "total_districts_reached": districts_reached,
            "statewide_coverage_pct": min(coverage_pct, 100.0)
        })

