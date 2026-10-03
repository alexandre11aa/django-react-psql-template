from django.db.models import Q
from django.utils import timezone

from user.models import PasswordRecovery


def passwordrecovery_list_stale():
    """
    Lista as Recuperações de Senha que não servem mais: expiradas, já usadas ou invalidadas.
    """

    return PasswordRecovery.all_objects.filter(
        Q(expires_at__lt=timezone.now())
        | Q(used_at__isnull=False)
        | Q(invalidated_at__isnull=False)
    )
