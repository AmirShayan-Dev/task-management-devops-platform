# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Nginx for serving the built app
FROM nginx:alpine

# Override nginx.conf to set pid to /tmp and keep default http/events config
RUN echo 'pid /tmp/nginx.pid;' > /etc/nginx/nginx.conf && \
    echo 'events { worker_connections 1024; }' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    client_body_temp_path /tmp/client_temp;' >> /etc/nginx/nginx.conf && \
    echo '    proxy_temp_path /tmp/proxy_temp;' >> /etc/nginx/nginx.conf && \
    echo '    fastcgi_temp_path /tmp/fastcgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    uwsgi_temp_path /tmp/uwsgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    scgi_temp_path /tmp/scgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

# Create non-root user with correct permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
    && chown -R appuser:appgroup /tmp /usr/share/nginx \
    && apk add --no-cache wget

# Copy build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy server block config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix ownership of html and config
RUN chown -R appuser:appgroup /usr/share/nginx/html /etc/nginx/conf.d

# Run Nginx as non-root
USER appuser

# Healthcheck — must match the port nginx listens on
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8080/ || exit 1