#!/bin/sh

# Aplica migrações de usuário primeiro

echo "🚀 Applying makemigrations for Custom User..."

python /api/system/manage.py makemigrations user --noinput

# # Aplica migrações

# echo "🚀 Applying remaining makemigrations..."

# python /api/system/manage.py makemigrations archive --noinput
