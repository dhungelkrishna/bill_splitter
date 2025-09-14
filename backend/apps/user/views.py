from django.shortcuts import render
from rest_framework.views import APIView
from apps.user.serializers import CustomUserSerializer, CustomTokenObtainPairSerializer, LoginSerializer
from rest_framework import generics
from apps.user.models import CustomUser
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from apps.user.models import CustomUser, PendingUser
from apps.user.emails import send_otp_via_email


from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from bill_splitter.settings import EMAIL_HOST_USER

from bill_splitter.pagination import CustomPagination


class UserListCreate(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all().order_by('date_joined')
    serializer_class = CustomUserSerializer
    pagination_class = CustomPagination

    # def perform_create(self, serializer):
    #     if CustomUser.objects.filter(name=serializer.validated_data['email']).exists():
    #         raise serializers.ValidationError("email ali Unique Garnu Paryo. ")
    #     serializer.save()


class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")

        if not email or not phone or not password:
            return Response({"error": "All fields are required"}, status=400)
        #sending otp via email.
        send_otp_via_email(email, phone, password)
        return Response({"message": "OTP sent to your email."}, status=201)



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            access_token = str(refresh.access_token)
            response = Response({
                "refresh": str(refresh),
                "access": access_token
            }, status=status.HTTP_200_OK)

            return response
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class VerifyOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP required'}, status=400)

        try:
            pending_user = PendingUser.objects.get(email=email)
        except PendingUser.DoesNotExist:
            return Response({'error': 'No pending user found'}, status=404)

        if pending_user.otp != otp:
            return Response({'error': 'Invalid OTP'}, status=400)

        # Create the actual user
        user = CustomUser.objects.create(
            email=pending_user.email,
            phone=pending_user.phone,
            password=pending_user.password  # Already hashed
        )

        # Remove from pending
        pending_user.delete()

        return Response({'message': 'User verified and registered successfully.'}, status=201)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = CustomUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:3000/auth/reset-password?{uid}&{token}/"

            send_mail(
                "Paypasa Password Reset ",
                f"Click the link to reset your password: {reset_link}",
                "{EMAIL_HOST_USER}",
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset link sent."}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User with that email does not exist."}, status=400)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({"error": "Invalid or expired token."}, status=400)

            password = request.data.get("password")
            user.set_password(password)
            user.save()

            return Response({"message": "Password reset successful."}, status=200)
        except Exception as e:
            return Response({"error": "Something went wrong."}, status=400)
 