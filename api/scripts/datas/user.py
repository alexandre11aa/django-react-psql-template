import os
import django

# Registrando Dados
from django.core.exceptions import ObjectDoesNotExist
from user.models import CustomUser

# Configuração do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'system.core.settings')
django.setup()

if os.environ.get("DEBUG", "0") != "1":
    exit()

def create_superuser_if_not_exists(name, email, password):
    '''
    Cria superusuário ao iniciar container caso ele não exista
    '''
    
    # Tenta obter o colaborador pelo email
    try:
        existing_colaborador = CustomUser.objects.get(email=email)

        print('Admin default ativo.')

        return existing_colaborador

    # Se não existir, cria um novo colaborador e o usuário associado
    except ObjectDoesNotExist:
        user = CustomUser.objects.create_superuser(
            name=name,
            email=email,
            password=password,
            access_level='ADM',
        )
        user.save()

        print('Admin default ativado.')

        return user

# Criando colaboradores
superuser = create_superuser_if_not_exists(
    name='admin',
    email='admin@admin.com',
    password='admin',
)

exit()