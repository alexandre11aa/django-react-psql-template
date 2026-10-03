import uuid

from django.db import models
from django.db.models import Q
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from common.models import BaseModel, UserManager

from user.choices import ACCESS_LEVEL_CHOICES


class CustomUser(AbstractBaseUser, PermissionsMixin, BaseModel):
    """
    Modelo personalizado de usuário para a aplicação.

    Este modelo estende:
        - AbstractBaseUser: fornece funcionalidades básicas de autenticação.
        - PermissionsMixin: adiciona suporte a permissões e grupos.
        - BaseModel: modelo base da aplicação (presumivelmente com campos e métodos comuns).

    Atributos:
        code (UUIDField): Identificador único do usuário (UUID4), gerado automaticamente.
        name (CharField): Nome completo do colaborador.
        email (EmailField): Email do usuário, usado como campo de login e deve ser único.
        access_level (CharField): Nível de acesso do usuário, com opções definidas em ACCESS_LEVEL_CHOICES.
        is_staff (BooleanField): Indica se o usuário tem acesso ao admin do Django.
        is_superuser (BooleanField): Indica se o usuário possui permissões de superusuário.
    """

    uuid = models.UUIDField("Código uuid4", default=uuid.uuid4, editable=False)
    name = models.CharField('Nome do Colaborador', max_length=255)
    email = models.EmailField('Email', unique=True)
    access_level = models.CharField('Nível de Acesso', max_length=3, choices=ACCESS_LEVEL_CHOICES, default='DEV')

    is_staff = models.BooleanField('Is Staff', default=False)
    is_superuser = models.BooleanField('Is Superuser', default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email


class PasswordRecovery(BaseModel):
    """
    Modelo personalizado para recuperação de senha de usuário para a aplicação.

    Este modelo estende:
        - BaseModel: modelo base da aplicação (presumivelmente com campos e métodos comuns).

    Atributos:
        user (ForeignKey): Usuário ao qual a recuperação de senha pertence.
        token_hash (CharField): Hash do token de recuperação de senha.
        expires_at (DateTimeField): Data de expiração do token.
        used_at (DateTimeField): Data de uso do token.
        invalidated_at (DateTimeField): Data de invalidação do token.
    """

    user = models.ForeignKey(
        CustomUser, 
        verbose_name="Usuário", 
        on_delete=models.CASCADE,
        related_name='password_recoveries',
    )

    token_hash = models.CharField('Hash do Token', max_length=64, unique=True)
    expires_at = models.DateTimeField('Data de Expiração')
    used_at = models.DateTimeField('Data de Uso', null=True, blank=True)
    invalidated_at = models.DateTimeField('Data de Invalidação', null=True, blank=True)

    class Meta:
        verbose_name = "Recuperação de Senha"
        verbose_name_plural = "Recuperações de Senha"

        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=Q(
                    used_at__isnull=True,
                    invalidated_at__isnull=True
                ),
                name='unique_active_password_recovery_per_user'
            )
        ]

        indexes = [
            models.Index(fields=['token_hash']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return self.user.name