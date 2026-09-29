from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [AllowAny]

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "GQT CSR Django Backend API",
            "framework": "Django 6.1.1 + Django REST Framework",
            "version": "1.0.0",
            "endpoints": {
                "auth": "/api/v1/auth/",
                "drives": "/api/v1/drives/",
                "students": "/api/v1/students/",
                "assessments": "/api/v1/assessments/",
                "interviews": "/api/v1/interviews/",
                "offers": "/api/v1/offers/",
                "notifications": "/api/v1/notifications/",
                "audit": "/api/v1/audit/"
            }
        })
