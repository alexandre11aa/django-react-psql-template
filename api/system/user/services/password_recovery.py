from user.selectors.password_recovery import passwordrecovery_list_stale


def passwordrecovery_delete_stale():
    """
    Exclui definitivamente as Recuperações de Senha expiradas, usadas ou invalidadas.

    Retorna a quantidade de registros excluídos.
    """

    deleted, _ = passwordrecovery_list_stale().delete()

    return deleted
