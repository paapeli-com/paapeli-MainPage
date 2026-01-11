# Docker Setup - Development & Production

This project provides two Docker configurations:

## 🚀 Production Setup (Self-contained)
A production-ready Docker image that contains everything needed to run your React application without requiring volume mounts.

## 🛠️ Development Setup (With Volumes)
A development Docker setup with volume mounts that allows you to edit code and see changes in real-time.

## Production Setup

### What Changed

#### Dockerfile (Production)
- **Multi-stage build**: Uses Bun to build the application, then nginx:alpine to serve it
- **Production build**: Runs `bun run build` to create optimized static files
- **nginx server**: Serves the built files with proper SPA routing support

#### docker-compose.yml
- **No volumes**: The image is completely self-contained
- **Port mapping**: Runs on `8080:80` (nginx default port)
- **Production environment**: Optimized for deployment

#### nginx.conf
- **SPA routing**: Handles client-side routing by serving `index.html` for all routes
- **Gzip compression**: Optimizes file delivery
- **Static asset caching**: Long-term caching for JS/CSS/images
- **Security headers**: Basic security headers for production

### Usage (Production)

```bash
# Using Makefile (recommended)
make docker-prod-build
make docker-prod-up

# Or using Docker Compose directly
docker-compose build
docker-compose up -d

# Or build and run directly
docker build -t paapeli-app .
docker run -p 8080:80 paapeli-app
```

**Access**: http://localhost:8080

## Development Setup

### What Changed

#### Dockerfile.dev
- **Single stage**: Uses Bun runtime for development
- **All dependencies**: Includes dev dependencies for development tools
- **Dev server**: Runs `bun run dev` with hot reloading

#### docker-compose.dev.yml
- **Volume mounts**: Source code is mounted for live editing
- **Port mapping**: Runs on `5173:5173` (Vite default port)
- **Development environment**: Hot reloading and development tools

### Usage (Development)

```bash
# Using Makefile (recommended)
make docker-dev-build
make docker-dev-up

# Or using Docker Compose directly
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

**Access**: http://localhost:5173

**Live editing**: Edit files in your IDE and see changes instantly!

## Quick Commands

```bash
# Development (editable)
make docker-dev-up      # Start dev environment
make docker-dev-down    # Stop dev environment

# Production (self-contained)
make docker-prod-up     # Start production
make docker-prod-down   # Stop production

# Legacy (defaults to production)
make docker-up          # Start Docker
make docker-down        # Stop Docker
```

## Benefits

### Production Benefits
1. **Self-contained**: Everything needed is in the image
2. **Production-ready**: Optimized build with nginx
3. **Smaller image**: Multi-stage build excludes dev dependencies
4. **Fast startup**: No build step needed at runtime
5. **SPA support**: Proper routing for React Router
6. **Caching**: Optimized asset caching headers

### Development Benefits
1. **Live editing**: Edit code and see changes instantly
2. **Isolated environment**: Same dependencies as production
3. **Hot reloading**: Fast development cycle
4. **Volume persistence**: Changes persist across container restarts
5. **Same tooling**: Use same dev tools as local development

## File Structure

```
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development single-stage build
├── docker-compose.yml      # Production compose (default)
├── docker-compose.dev.yml  # Development compose
├── nginx.conf              # Production nginx config
├── .dockerignore           # Build optimization
└── Makefile               # Convenient commands
```

## When to Use Each Setup

- **Development**: When you need to edit code and see changes live
- **Production**: When you want to deploy a self-contained, optimized image
- **CI/CD**: Use production setup for automated builds and deployments
- **Local testing**: Use development setup for testing production-like environment locally