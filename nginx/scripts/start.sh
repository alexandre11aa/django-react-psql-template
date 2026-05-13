#!/bin/sh

if [ -f "/etc/letsencrypt/live/$SERVER_NAME/fullchain.pem" ]; then
  echo "🔐 HTTPS active"
  envsubst '${SERVER_NAME} ${DEBUG}' < /etc/nginx/conf.d/https.conf.template > /etc/nginx/conf.d/default.conf

else
  echo "🌐 HTTP active"
  envsubst '${SERVER_NAME} ${DEBUG}' < /etc/nginx/conf.d/http.conf.template > /etc/nginx/conf.d/default.conf
  
fi

nginx -g "daemon off;"