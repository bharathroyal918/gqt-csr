from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferLetterViewSet, RespondOfferLetterView

router = DefaultRouter()
router.register(r'letters', OfferLetterViewSet, basename='offer-letter')

urlpatterns = [
    path('letters/<int:pk>/respond/', RespondOfferLetterView.as_view(), name='offer-respond'),
    path('', include(router.urls)),
]
