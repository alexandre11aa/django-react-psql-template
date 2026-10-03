from django.core.management.base import BaseCommand
from django.utils import timezone

from user.services.password_recovery import passwordrecovery_delete_stale


class Command(BaseCommand):
    help = (
        "Exclui os tokens de recuperação de senha expirados, já usados "
        "ou invalidados."
    )

    def handle(self, *args, **options):
        deleted = passwordrecovery_delete_stale()

        now = timezone.localtime().strftime("%d/%b/%Y %H:%M:%S")

        self.stdout.write(
            self.style.SUCCESS(f"[{now}] Tokens de recuperação de senha removidos: {deleted}")
        )
