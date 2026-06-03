##############
# BUILD STAGE
##############
FROM node:24-bookworm-slim AS build

# Set working directory inside container
WORKDIR /app

# Copy only dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the full source code into the container
COPY . .

# Buildstatic files (outputs to /dist)
RUN npm run build


#################
# RUNTIME STAGE
#################
FROM nginx:stable-alpine

# Create non-root user and required directories for Nginx runtime
RUN addgroup -S appgroup \
 && adduser -S appuser -G appgroup \
 && mkdir -p \
    /tmp/client_temp \
    /tmp/proxy_temp \
    /tmp/fastcgi_temp \
    /tmp/uwsgi_temp \
    /tmp/scgi_temp \
    /var/cache/nginx \
    /var/log/nginx \
 && chown -R appuser:appgroup \
    /tmp \
    /var/cache/nginx \
    /var/log/nginx


# Copy custom Nginx configuration 
COPY nginx.conf /etc/nginx/nginx.conf

# Copy compiled frontend build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# static files ownership
RUN chown -R appuser:appgroup /usr/share/nginx/html

# Switch to non-root user 
USER appuser

# Expose application port
EXPOSE 8080

# Healthcheck 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:8080/ || exit 1

# Start Nginx in foreground mode 
CMD ["nginx", "-g", "daemon off;"]