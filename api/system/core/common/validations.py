from django.db.models import QuerySet
from django.shortcuts import get_object_or_404


def auth_access_level(access_level: str, auths: list[str]) -> tuple[bool, str]:
    """Verifica se o cargo do usuário está na lista de permissão de acessos."""

    if access_level not in auths:
        return (False, "O usuário não tem permissão de acesso!")

    return (True, "")


def instance_is_active(entity: QuerySet, instance_id: int) -> tuple[bool, str]:
    """Verifica se a instancia está ativa ou inativa."""

    instance = get_object_or_404(entity, pk=instance_id)

    if instance.is_active is not True:
        return (False, f"A instância está inativa!")

    return (True, "")


def is_size_ok(size: float, limit_size: float = 100000000):
    """Verifica se o arquivo enviado tem o tamanho adequado."""

    if (size is not None) and (size > limit_size):
        return (False, f"O arquivo excedeu o limite de {size / 1000000:.2f} megabytes!")
    
    return (True, "")


def is_extension_ok(extension: str, extensions_ok: list[str] = ['PDF']):
    """Verifica se a extensão do arquivo inserido é permitida."""

    if (extension is not None) and (extension not in extensions_ok):
        return (False, f"A extensão do arquivo inserido não é permitida!")
    
    return (True, "")