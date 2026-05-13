#!/bin/sh

# O shell irá encerrar a execução do script quando um comando falhar
set -e

# Espera o PostgreSQL estar pronto para aceitar conexões
wait_psql.sh

# Coleta os arquivos estáticos do Django
collectstatic.sh

# Executa makemigrations do Django
if [ "${DJANGO_ENV:-0}" = "1" ]; then
    makemigrations.sh
fi

# Executa as migrações do Django
migrate.sh

# Injeta os dados teste (OPCIONAL)
if [ "${DJANGO_ENV:-0}" = "1" ]; then
    python manage.py shell < /scripts/datas/user.py
fi

# Inicia o servidor de desenvolvimento do Django
runserver.sh
