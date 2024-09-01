# Dockerfile
FROM nginx:alpine

RUN apk add --no-cache gettext openssl 

# Copy Nginx configuration template
COPY docker/nginx/nginx.conf.template /etc/nginx/nginx.conf.template

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Copy startup script
COPY docker/nginx/start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

# Start Nginx using our custom script
CMD ["/start-nginx.sh"]
