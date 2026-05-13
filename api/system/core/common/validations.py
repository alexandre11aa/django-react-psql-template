from django.db.models import QuerySet
from django.shortcuts import get_object_or_404


def auth_access_level(access_level: str, auths: list[str]) -> tuple[bool, str]:
    """Verifica se o cargo do usuário está na lista de permissão de acessos."""

    if access_level not in auths:
        return (False, "O usuário não tem permissão de acesso!")

    return (True, "")
