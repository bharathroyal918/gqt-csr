from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from .models import OfferLetter
from .serializers import OfferLetterSerializer

class OfferLetterViewSet(viewsets.ModelViewSet):
    queryset = OfferLetter.objects.all().order_by('-issued_at')
    serializer_class = OfferLetterSerializer
    permission_classes = [AllowAny]

class RespondOfferLetterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        action = request.data.get('action') # 'accept' or 'decline'
        offer = OfferLetter.objects.filter(id=pk).first()
        if not offer:
            return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

        if action == 'accept':
            offer.status = 'Accepted'
            offer.responded_at = timezone.now()
            offer.save()
            student = offer.student
            student.status = 'Placed'
            student.save()
            return Response({"message": "Offer accepted successfully", "status": offer.status})
        elif action == 'decline':
            offer.status = 'Declined'
            offer.responded_at = timezone.now()
            offer.save()
            return Response({"message": "Offer declined", "status": offer.status})
        else:
            return Response({"error": "Invalid action, must be 'accept' or 'decline'"}, status=status.HTTP_400_BAD_REQUEST)
