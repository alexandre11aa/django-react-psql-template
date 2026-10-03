from django.db import transaction

from common.utils import send_email


def customuser_create(*, serializer):
    """
    Persiste um novo Usuário a partir de um serializer já validado.
    """

    return serializer.save()


def customuser_update(*, serializer):
    """
    Persiste a atualização de um Usuário a partir de um serializer já validado.
    """

    return serializer.save()


def customuser_toggle_active(*, instance):
    """
    Inativa um Usuário ativo, ou recupera um Usuário inativo.
    """

    if instance.is_active:
        instance.soft_delete()
    else:
        instance.recover()

    return instance


def customuser_send_welcome_email(*, user, password):
    """
    Agenda, após o commit da transação, o e-mail com as credenciais de acesso do novo Usuário.
    """

    html = f"""
        <p>Olá, {user.name}!</p>

        <p>Seu acesso ao <b>Sistema</b> já está disponível. Seguem abaixo suas credenciais:</p><br>

        <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
        <td style="background:#f4f4f4;padding:15px;border-radius:8px;width:320px;">
        <b>Login:</b> <a href="mailto:{user.email}">{user.email}</a><br>
        <b>Senha:</b> {password}
        </td>

        <td style="padding-left:20px; vertical-align: middle;">
        <a href="http://127.0.0.1:5173/login" 
        style="background:#2c7be5;color:white;padding:10px 18px;text-decoration:none;border-radius:6px; display:inline-block;"
        >Acessar o Sistema</a>
        </td>
        </tr>
        </table>

        <br><p>Após o primeiro acesso, recomendamos alterar sua <b>senha</b> <a href="http://127.0.0.1:5173/profile_user">clicando aqui</a> para maior segurança!</p>

        <p>Caso tenha qualquer dúvida ou precise de suporte, estamos à disposição.</p>

        <p>
        Atenciosamente,<br>
        <b>Equipe de Desenvolvimento</b><br>
        Sistema de Autenticação
        </p>
        """

    transaction.on_commit(lambda: send_email(
        subject="Criação de Usuário do Sistema",
        body=f"Olá {user.name}, Sua conta foi criada no Sistema!",
        to_emails=[user.email],
        html_body=html,
    ))
