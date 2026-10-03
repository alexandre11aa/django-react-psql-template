from django.contrib.auth.models import AnonymousUser
from simple_history.models import HistoricalRecords


class _LazyJWTRequest:
    """
    Request exposto ao django-simple-history para descobrir quem fez a alteração.

    O Nexus autentica por JWT em cookie, e o DRF só resolve `request.user` dentro da view,
    depois dos middlewares. Por isso o usuário é resolvido aqui, de forma preguiçosa (só
    quando um histórico é gravado) e com cache, usando a mesma CookieJWTAuthentication das views.
    """

    def __init__(self, request):
        self._request = request
        self._user = None

    @property
    def user(self):
        if self._user is not None:
            return self._user

        user = getattr(self._request, 'user', None)

        if user is None or not user.is_authenticated:
            # Import tardio: evita ciclo de importação na carga dos middlewares
            from auth.views import CookieJWTAuthentication

            try:
                authenticated = CookieJWTAuthentication().authenticate(self._request)
            except Exception:
                authenticated = None

            user = authenticated[0] if authenticated else AnonymousUser()

        self._user = user
        return self._user


class HistoryUserMiddleware:
    """
    Guarda o request da requisição atual para o django-simple-history preencher
    `history_user` (quem criou, alterou ou inativou o registro).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        HistoricalRecords.context.request = _LazyJWTRequest(request)

        try:
            return self.get_response(request)
        finally:
            if hasattr(HistoricalRecords.context, 'request'):
                del HistoricalRecords.context.request
