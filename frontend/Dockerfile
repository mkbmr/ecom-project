# Stage 1: Build the react app
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy in the source code
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Install dependencies
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx.conf to override default routing
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to outside world
EXPOSE 80

# Start Nginx in the foreground so container continues running
CMD ["nginx", "-g", "daemon off;"]