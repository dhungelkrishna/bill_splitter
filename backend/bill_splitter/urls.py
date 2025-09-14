from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from apps.user.views import LoginView, VerifyOTP, ForgotPasswordView, ResetPasswordView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('apps.user.urls')),
    path('api/',include('apps.group.urls')),
    path('api/',include('apps.group_user.urls')),
    path('api/',include('apps.expenses.urls')),
    path('api/',include('apps.splits.urls')),
    path('api/',include('apps.payment.urls')),
    path('api/',include('apps.balance.urls')),
    path('api/',include('apps.activity_log.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify-otp/', VerifyOTP.as_view(), name='verify-otp'),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),

    ] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)