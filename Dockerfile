# Stage 1: Build the Node.js application
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy project files
COPY . .
# Build the application
RUN npm run build && rm -rf node_modules

# Stage 2: Serve the built application with NGINX
FROM nginx:alpine
# Copy the built application
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
