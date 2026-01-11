# syntax=docker/dockerfile:1

# Build stage
FROM oven/bun:1.3 AS builder

# Labels for better maintainability
LABEL maintainer="Paapeli Team"
LABEL description="Paapeli Frontend - Production Build Stage"
LABEL version="1.0"

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install all dependencies (including dev dependencies needed for build)
RUN bun install

# Copy source code (only necessary files for build)
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig*.json ./

# Build the application
RUN bun run build

# Production stage
FROM nginx:alpine

# Labels for better maintainability
LABEL maintainer="Paapeli Team"
LABEL description="Paapeli Frontend - Production Server"
LABEL version="1.0"

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]