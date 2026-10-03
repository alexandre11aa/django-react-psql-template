import secrets
import hashlib

from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives


def send_email(subject: str, body: str, to_emails: list, html_body: str = None):
    """
    Função auxiliar para envio de e-mails.

    :subject: Assunto do e-mail
    :body: Corpo do e-mail (texto simples)
    :to_emails: Lista de destinatários
    :html_body: (Opcional) Corpo em HTML
    """

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=to_emails,
    )

    if html_body:
        email.attach_alternative(html_body, "text/html")

    email.send(fail_silently=False)


def generate_token(expiration_minutes: int = 15):
    """
    Função auxiliar para geração de tokens seguros.

    :expiration_minutes: Tempo de expiração do token em minutos

    return:
        token: Token em texto (para envio ao usuário)
        token_hash: Hash do token (para armazenamento seguro)
        expires_at: Data de expiração do token
    """

    # Gera token seguro (URL-safe)
    token = secrets.token_urlsafe(32)

    # Gera hash SHA-256
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    # Define expiração
    expires_at = timezone.now() + timedelta(minutes=expiration_minutes)

    return token, token_hash, expires_at