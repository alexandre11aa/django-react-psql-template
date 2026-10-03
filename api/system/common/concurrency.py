import threading

from functools import wraps

from rest_framework import status
from rest_framework.response import Response


def limit_concurrency(max_concurrent, timeout):
    """
    Limita a quantidade de requisições processadas ao mesmo tempo pela view decorada.

    Acima do limite, a requisição espera uma vaga ser liberada (sem ser rejeitada) por
    até `timeout` segundos; passado esse tempo, responde 503.

    O controle é feito por um semáforo do processo: com vários workers, cada um tem o seu.
    """

    semaphore = threading.BoundedSemaphore(max_concurrent)

    def decorator(view):

        @wraps(view)
        def wrapper(*args, **kwargs):

            if not semaphore.acquire(timeout=timeout):
                return Response(
                    {"detail": "Servidor ocupado. Tente novamente em instantes."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            try:
                return view(*args, **kwargs)
            finally:
                semaphore.release()

        return wrapper

    return decorator
