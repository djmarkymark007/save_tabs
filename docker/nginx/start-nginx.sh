#!/bin/sh
set -e


# Substitute environment variables in the Nginx config
envsubst '${APP_HOST} ${APP_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# List contents of SSL directory
echo "Contents of /etc/nginx/ssl:"
ls -l /etc/nginx/ssl

# Display and verify SSL certificate
echo "\nDisplaying SSL certificate contents:"
cat /etc/nginx/ssl/localhost.crt
echo "\nVerifying SSL certificate:"
openssl x509 -in /etc/nginx/ssl/localhost.crt -noout -text

# Display and verify SSL key (without showing the actual key)
echo "\nVerifying SSL key:"
openssl rsa -in /etc/nginx/ssl/localhost.key -check -noout

# Start Nginx
echo "Starting Nginx..."
nginx -g 'daemon off;'
