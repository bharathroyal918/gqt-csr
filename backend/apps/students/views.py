from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import College, Student
from .serializers import CollegeSerializer, StudentSerializer

class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all().order_by('name')
    serializer_class = CollegeSerializer
    permission_classes = [AllowAny]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('-created_at')
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        college_param = self.request.query_params.get('college')
        dept_param = self.request.query_params.get('department')
        search_param = self.request.query_params.get('search')

        if status_param:
            queryset = queryset.filter(status=status_param)
        if college_param:
            queryset = queryset.filter(college_id=college_param)
        if dept_param:
            queryset = queryset.filter(department__iexact=dept_param)
        if search_param:
            queryset = queryset.filter(full_name__icontains=search_param) | queryset.filter(usn__icontains=search_param)

        return queryset

class StudentStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_students = Student.objects.count()
        placed_students = Student.objects.filter(status__in=['Selected', 'Placed']).count()
        qualified_students = Student.objects.filter(status__in=['Qualified', 'Interview_Scheduled', 'Selected', 'Placed']).count()

        return Response({
            "total_registered": total_students,
            "qualified_cutoff": qualified_students,
            "placed_offers": placed_students,
            "conversion_rate_pct": round((placed_students / total_students * 100), 1) if total_students > 0 else 0
        })
