#!/bin/sh

# Aplica migrações

echo "🚀 Applying migrations..."

python /api/system/manage.py migrate --noinput
