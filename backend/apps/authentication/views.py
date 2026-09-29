from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.filter(username=email).first()

        if user and user.check_password(password):
            login(request, user)
            profile, _ = UserProfile.objects.get_or_create(user=user)
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "role": profile.role_key
            })

        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out"})

class MeView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"authenticated": False, "user": None}, status=status.HTTP_200_OK)
        return Response({
            "authenticated": True,
            "user": UserSerializer(request.user).data
        })

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
