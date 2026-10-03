import hashlib
import time

from django.core.cache import cache

from rest_framework.exceptions import Throttled
from rest_framework.throttling import BaseThrottle, SimpleRateThrottle


class RateLimited(Throttled):
    """
    Resposta 429 dos endpoints públicos, com mensagem em português.
    """

    default_detail = "Muitas tentativas."
    extra_detail_singular = "Tente novamente em {wait} segundo."
    extra_detail_plural = "Tente novamente em {wait} segundos."


def _hash(value):
    return hashlib.sha256(value.encode()).hexdigest()


def _email_identity(request):
    """
    E-mail informado na requisição, normalizado (None se ausente ou inválido).
    """

    email = request.data.get('email') if hasattr(request.data, 'get') else None

    if not isinstance(email, str) or not email.strip():
        return None

    return _hash(email.strip().lower())


def _ip_identity(request):
    """
    IP de origem da requisição.
    """

    return f'ip-{BaseThrottle().get_ident(request)}'


## Bases


class IdentityRateThrottle(SimpleRateThrottle):
    """
    Limita as requisições de uma mesma identidade (e-mail ou IP) por janela de tempo.

    Subclasses definem `scope`, `rate` ("N/min") e `identity`. Quando `identity` não
    encontra a identidade na requisição, limita pelo IP de origem.
    """

    def identity(self, request):
        raise NotImplementedError

    def get_cache_key(self, request, view):
        ident = self.identity(request) or _ip_identity(request)

        return self.cache_format % {'scope': self.scope, 'ident': ident}


class DistinctIdentitiesThrottle(BaseThrottle):
    """
    Limita a quantidade de identidades (e-mails ou IPs) distintas que usam o endpoint no mesmo minuto.

    Uma identidade já contada no minuto corrente continua podendo tentar (respeitando
    o limite individual). Subclasses definem `scope`, `max_users` e `identity`.
    """

    window = 60  # segundos
    max_users = 100

    def identity(self, request):
        raise NotImplementedError

    def allow_request(self, request, view):
        ident = self.identity(request)

        if ident is None:
            return True

        bucket = int(time.time() // self.window)
        user_key = f"{self.scope}_users:{bucket}:{ident}"
        count_key = f"{self.scope}_users_count:{bucket}"

        # Identidade já contada neste minuto
        if not cache.add(user_key, 1, self.window):
            return True

        cache.add(count_key, 0, self.window)
        count = cache.incr(count_key)

        if count > self.max_users:
            # Não consome vaga: desfaz a contagem desta identidade
            cache.decr(count_key)
            cache.delete(user_key)
            self._wait = self.window - (time.time() % self.window)
            return False

        return True

    def wait(self):
        return getattr(self, '_wait', None)


## Login: 3 tentativas/min por usuário, 100 usuários/min


class LoginEmailThrottle(IdentityRateThrottle):
    scope = 'login_email'
    rate = '3/min'
    identity = staticmethod(_email_identity)


class LoginGlobalUsersThrottle(DistinctIdentitiesThrottle):
    scope = 'login'
    identity = staticmethod(_email_identity)


## Solicitação de recuperação de senha: 3 solicitações/min por e-mail, 100 e-mails/min


class PasswordResetRequestEmailThrottle(IdentityRateThrottle):
    scope = 'password_reset_request_email'
    rate = '3/min'
    identity = staticmethod(_email_identity)


class PasswordResetRequestGlobalThrottle(DistinctIdentitiesThrottle):
    scope = 'password_reset_request'
    identity = staticmethod(_email_identity)


## Redefinição de senha (o corpo traz token, não e-mail): 5 tentativas/min por IP, 100 IPs/min


class PasswordResetIPThrottle(IdentityRateThrottle):
    scope = 'password_reset_ip'
    rate = '5/min'
    identity = staticmethod(_ip_identity)


class PasswordResetGlobalIPThrottle(DistinctIdentitiesThrottle):
    scope = 'password_reset'
    identity = staticmethod(_ip_identity)


## Refresh e logout (sem corpo): limite por IP folgado, pois o front dispara
## várias renovações juntas quando o access_token expira


class RefreshIPThrottle(IdentityRateThrottle):
    scope = 'refresh_ip'
    rate = '30/min'
    identity = staticmethod(_ip_identity)


class LogoutIPThrottle(IdentityRateThrottle):
    scope = 'logout_ip'
    rate = '30/min'
    identity = staticmethod(_ip_identity)
