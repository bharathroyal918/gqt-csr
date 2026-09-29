from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.views import APIView

class RootApiView(APIView):
    def get(self, request):
        return Response({
            "platform": "Global Quest Technologies (GQT) CSR Drive Platform",
            "version": "v1.0.0",
            "backend": "Django REST Framework",
            "api_root": "/api/v1/",
            "modules": {
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

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RootApiView.as_view(), name='root-api'),
    path('api/v1/', RootApiView.as_view(), name='api-v1-root'),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/drives/', include('apps.drives.urls')),
    path('api/v1/students/', include('apps.students.urls')),
    path('api/v1/assessments/', include('apps.assessments.urls')),
    path('api/v1/interviews/', include('apps.interviews.urls')),
    path('api/v1/offers/', include('apps.offers.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/audit/', include('apps.audit.urls')),
]
