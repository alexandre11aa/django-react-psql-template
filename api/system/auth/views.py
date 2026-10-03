import os
import hashlib

from datetime import (
    datetime, 
    timezone as py_timezone
)

from django.utils import timezone
from django.db import transaction

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from drf_yasg.utils import swagger_auto_schema

from user.models import (
    CustomUser,
    PasswordRecovery
)

from common.utils import (
    send_email,
    generate_token
)

from common.concurrency import limit_concurrency

from auth.throttles import (
    LoginEmailThrottle,
    LoginGlobalUsersThrottle,
    LogoutIPThrottle,
    PasswordResetGlobalIPThrottle,
    PasswordResetIPThrottle,
    PasswordResetRequestEmailThrottle,
    PasswordResetRequestGlobalThrottle,
    RateLimited,
    RefreshIPThrottle,
)

from auth.serializers import (
    LoginSerializer, 
    CustomTokenObtainPairSerializer,
    EmailSerializer,
    ResetPasswordSerializer,
)


# Limite de concorrência compartilhado por todos os endpoints públicos:
# o servidor processa no máximo 80 requisições públicas ao mesmo tempo e as demais aguardam vaga
public_concurrency_limit = limit_concurrency(max_concurrent=80, timeout=30)


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
        except Exception:
            return None

        return self.get_user(validated_token), validated_token



class AuthViewSet(viewsets.ViewSet):

    def throttled(self, request, wait):
        raise RateLimited(wait=int(wait) + 1 if wait else 60)

    @swagger_auto_schema(request_body=LoginSerializer, responses={200: 'Success'})
    @action(
        detail=False, methods=['post'], permission_classes=[AllowAny],
        throttle_classes=[LoginGlobalUsersThrottle, LoginEmailThrottle],
    )
    @public_concurrency_limit
    def login(self, request):

        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)

        token_serializer = CustomTokenObtainPairSerializer(data=login_serializer.validated_data)
        token_serializer.is_valid(raise_exception=True)
        
        access = token_serializer.validated_data['access']
        refresh = token_serializer.validated_data['refresh']

        response = Response({"detail": "Login realizado com sucesso."}, status=status.HTTP_200_OK)

        user = token_serializer.user

        response_data = {
            "detail": "Login realizado com sucesso.",
            "access_level": user.access_level,
            "email": user.email,
            "name": user.name,
            "id": user.id,
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=(os.getenv('SECURY_COOKIES', 'False') in ['true', 'True']),
            samesite='Lax',
            max_age=60*5  # 5 minutos
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh,
            httponly=True,
            secure=(os.getenv('SECURY_COOKIES', 'False') in ['true', 'True']),
            samesite='Lax',
            max_age=60*60*24  # 1 dias
        )

        return response
    
    @action(
        detail=False, methods=['post'], authentication_classes=[], permission_classes=[AllowAny],
        throttle_classes=[LogoutIPThrottle],
    )
    @public_concurrency_limit
    def logout(self, request):
        response = Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

    @action(
        detail=False, methods=['post'], authentication_classes=[CookieJWTAuthentication], permission_classes=[AllowAny],
        throttle_classes=[RefreshIPThrottle],
    )
    @public_concurrency_limit
    def refresh(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({"detail": "Refresh token não encontrado."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
            serializer.is_valid(raise_exception=True)
            access = serializer.validated_data['access']

            response = Response({"detail": "Token renovado."}, status=status.HTTP_200_OK)

            response.set_cookie(
                key='access_token',
                value=access,
                httponly=True,
                secure=(os.getenv('SECURY_COOKIES', 'False') in ['true', 'True']),
                samesite='Lax',
                max_age=60*5  # 5 minutos
            )

            return response

        except Exception:
            return Response({"detail": "Refresh token inválido ou expirado."}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['get'], authentication_classes=[CookieJWTAuthentication], permission_classes=[IsAuthenticated])
    def validate_cookie(self, request):
        return Response({"detail": "Token válido."}, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(request_body=EmailSerializer, responses={200: 'Success'})
    @action(
        detail=False, methods=['post'], permission_classes=[AllowAny],
        throttle_classes=[PasswordResetRequestGlobalThrottle, PasswordResetRequestEmailThrottle],
    )
    @public_concurrency_limit
    def request_password_reset(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Email não encontrado no sistema!"}, status=status.HTTP_404_NOT_FOUND)

        token, token_hash, expires_at = generate_token(480)

        try:
            with transaction.atomic():

                # invalida tokens ativos
                PasswordRecovery.objects.filter(
                    user=user,
                    used_at__isnull=True,
                    invalidated_at__isnull=True
                ).update(invalidated_at=timezone.now())

                PasswordRecovery.objects.create(
                    user=user,
                    token_hash=token_hash,
                    expires_at=expires_at
                )

                reset_link = f"{os.getenv('FRONTEND_URL', 'http://127.0.0.1:5173')}/password_reset/{token}"

                html = f"""
                <p>Olá, {user.name}!</p>

                <p>
                Você solicitou a recuperação de sua senha de acesso ao <b>Sistema</b>.
                </p><br>

                <p style="margin-top:20px">
                <a href="{reset_link}" style="background:#2c7be5;color:white;padding:10px 18px;text-decoration:none;border-radius:6px">
                Clique aqui para cadastrar sua nova senha!
                </a>
                </p>

                <br><p>Caso tenha qualquer dúvida ou precise de suporte, estamos à disposição.</p>

                <p>
                Atenciosamente,<br>
                <b>Equipe de P&D</b><br>
                CETEC Engenharia
                </p>
                """

                transaction.on_commit(lambda: send_email(
                    subject="Recuperação de Senha do Sistema",
                    body=f"Olá, {user.name}! Acesse o link para redefinir sua senha: {reset_link}",
                    to_emails=[user.email],
                    html_body=html,
                ))

                return Response({"detail": "Email de recuperação enviado!"}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"detail": "Erro interno ao processar solicitação."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @swagger_auto_schema(request_body=ResetPasswordSerializer, responses={200: 'Success'})
    @action(
        detail=False, methods=['post'], permission_classes=[AllowAny],
        throttle_classes=[PasswordResetGlobalIPThrottle, PasswordResetIPThrottle],
    )
    @public_concurrency_limit
    def password_reset(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['password']
        
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        try:
            recovery = PasswordRecovery.objects.select_related('user').get(token_hash=token_hash)
        except PasswordRecovery.DoesNotExist:
            return Response(
                {"detail": "Token inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if (
            recovery.used_at is not None or
            recovery.invalidated_at is not None or
            recovery.expires_at < timezone.now()
        ):
            return Response(
                {"detail": "Token inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = recovery.user

        user.set_password(new_password)
        user.save()

        recovery.used_at = timezone.now()
        recovery.save(update_fields=['used_at'])

        return Response(
            {"detail": "Senha redefinida com sucesso."},
            status=status.HTTP_200_OK
        )
