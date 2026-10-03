#!/bin/sh

# O cron roda os jobs com um ambiente próprio, sem as variáveis do container
# (Postgres, e-mail etc). Persiste o ambiente atual num arquivo
# que cada linha do crontab carrega antes de rodar o comando.

/venv/bin/python -c '
import os
import shlex

with open("/etc/container_environment.sh", "w") as f:
    for key, value in os.environ.items():
        f.write(f"export {key}={shlex.quote(value)}\n")
'
chmod 600 /etc/container_environment.sh

echo "🕒 Starting cron daemon..."

cron
