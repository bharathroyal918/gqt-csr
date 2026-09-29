from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Notification, WhatsAppLog, EmailLog
from .serializers import NotificationSerializer, WhatsAppLogSerializer, EmailLogSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')
        role = self.request.query_params.get('role')
        if email:
            queryset = queryset.filter(recipient_email=email)
        if role:
            queryset = queryset.filter(recipient_role=role)
        return queryset

class DispatchNotificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        title = request.data.get('title')
        message = request.data.get('message')
        category = request.data.get('category', 'system')
        recipient_email = request.data.get('recipient_email', 'all@globalquesttechnologies.com')
        recipient_role = request.data.get('recipient_role')
        channels = request.data.get('channels', ['in_app'])

        created_items = []
        if 'in_app' in channels:
            n = Notification.objects.create(
                title=title,
                message=message,
                category=category,
                recipient_email=recipient_email,
                recipient_role=recipient_role,
                channel='in_app'
            )
            created_items.append(f"in_app:{n.id}")

        if 'email' in channels:
            e = EmailLog.objects.create(
                to_email=recipient_email,
                subject=title,
                body=message,
                status='SENT'
            )
            created_items.append(f"email:{e.id}")

        return Response({
            "message": "Notification dispatched successfully",
            "dispatches": created_items
        }, status=status.HTTP_201_CREATED)
