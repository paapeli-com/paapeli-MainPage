# Connecting Frontend to Backend Platform

This guide explains how to connect the Paapeli frontend (React/Vite app) to the Paapeli platform backend through APISIX Gateway.

## Architecture Overview

```
┌─────────────────────┐
│  paapeli-MainPage   │ (React + Vite on port 5173)
│  Frontend Dev Server│
└──────────┬──────────┘
           │
           ↓ Routes through APISIX
┌─────────────────────┐
│   APISIX Gateway    │ (Port 80, domain-based routing)
│  app.paapeli.local  │ → Frontend (host.docker.internal:5173)
│  api.paapeli.local  │ → Backend API (api:8080)
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  paapeli-platform   │ (Go API + Services)
│   Backend Services  │
└─────────────────────┘
```

## Setup Instructions

### 1. Configure Backend Platform

First, set up the backend platform with the frontend route:

```bash
cd paapeli-platform

# Create .env file if it doesn't exist
cp .env.example .env

# Optional: Customize frontend host/port in .env
# FRONTEND_HOST=host.docker.internal  # Default, works for Docker Desktop
# FRONTEND_PORT=5173                   # Default, Vite's default port

# Start the platform (this will generate APISIX config and add hosts entries)
make up
```

The `make up` command will:
- Generate APISIX configuration with the frontend route
- Add `app.paapeli.local` to your `/etc/hosts`
- Start all backend services including APISIX Gateway

### 2. Configure Frontend Environment

Navigate to the frontend project:

```bash
cd ../paapeli-MainPage

# Environment variables are already configured in .env.development
# Update AWS Cognito credentials if needed:
# VITE_COGNITO_USER_POOL_ID=your-pool-id
# VITE_COGNITO_CLIENT_ID=your-client-id
# VITE_COGNITO_REGION=your-region
```

The `.env.development` file contains:
- `VITE_API_BASE_URL=http://api.paapeli.local` - Routes API calls through APISIX

### 3. Start Frontend Development Server

You can run the frontend either with npm/bun directly or using Docker:

#### Option A: Direct (npm/bun)

```bash
cd paapeli-MainPage

# Install dependencies (first time only)
npm install
# or: bun install

# Start the Vite dev server
npm run dev
# or: bun run dev
```

#### Option B: Docker

```bash
cd paapeli-MainPage

# Build and start with Docker Compose
docker-compose up
```

The frontend will start on port 5173 (Vite's default port, as configured in `vite.config.ts`).

### 4. Access the Application

Open your browser and navigate to:

**Frontend Application:**
- http://app.paapeli.local - Main frontend (routes through APISIX)

**Backend Services:**
- http://api.paapeli.local - Backend API
- http://docs.paapeli.local - API Documentation (Swagger UI)
- http://grafana.paapeli.local - Grafana Dashboard

### 5. Verify Connection

To verify the frontend can communicate with the backend:

1. Open http://app.paapeli.local in your browser
2. Try to log in or register (uses AWS Cognito)
3. Navigate to the Devices page
4. The frontend should fetch device data from the backend API

Check browser console for any API errors. You should see requests going to:
- `http://api.paapeli.local/api/v1/...`

## Environment Variables

### Backend (.env in paapeli-platform)

```bash
# Frontend routing configuration
FRONTEND_HOST=host.docker.internal
FRONTEND_PORT=5173

# Domain configuration
DOMAIN_SUFFIX=paapeli.local
```

### Frontend (.env.development in paapeli-MainPage)

```bash
# API Configuration
VITE_API_BASE_URL=http://api.paapeli.local

# AWS Cognito (update with your credentials)
VITE_COGNITO_USER_POOL_ID=your-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_COGNITO_REGION=us-east-1
```

## Port Configuration

The frontend uses **port 5173** (Vite's default) to avoid conflicts:
- **Port 8080**: Backend API (paapeli-platform)
- **Port 3000**: Grafana Dashboard (paapeli-platform)
- **Port 5173**: Frontend Dev Server (paapeli-MainPage) ✓

### Customizing the Frontend Port

If you need to use a different port:

1. Update `paapeli-MainPage/vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 8081,  // Change to any available port
},
```

2. Update `paapeli-MainPage/Dockerfile`:
```dockerfile
EXPOSE 8081
```

3. Update `paapeli-MainPage/docker-compose.yml`:
```yaml
ports:
  - "8081:8081"
```

4. Update backend `.env`:
```bash
FRONTEND_PORT=8081
```

5. Regenerate APISIX config:
```bash
cd paapeli-platform
./scripts/generate-apisix-config.sh
docker-compose -f infra/docker-compose/docker-compose.yml restart apisix
```

## Troubleshooting

### Frontend can't connect to backend

1. **Check APISIX is running:**
```bash
cd paapeli-platform
docker ps | grep apisix
```

2. **Verify hosts file:**
```bash
cat /etc/hosts | grep paapeli
# Should show app.paapeli.local and api.paapeli.local
```

3. **Check frontend is accessible:**
```bash
curl http://localhost:5173
# Should return HTML from Vite dev server
```

4. **Check APISIX routing:**
```bash
curl -I http://app.paapeli.local
# Should return 200 OK if routing works
```

### CORS errors

CORS is already configured in the backend (`services/backend/internal/middleware/cors.go`). If you still see CORS errors:

1. Check that requests are going through APISIX (http://api.paapeli.local)
2. Don't bypass APISIX by calling backend directly (http://localhost:8080)

### Authentication issues

1. **Verify Cognito configuration in frontend `.env.development`**
2. **Check that JWT tokens are being sent in Authorization header**
3. **Verify backend AUTH_PROVIDER is set correctly in backend `.env`**

### Changes not appearing

1. **Backend changes:** Restart the backend service
```bash
cd paapeli-platform
docker-compose -f infra/docker-compose/docker-compose.yml restart api
```

2. **Frontend changes:** Vite should hot-reload automatically
   - If not, restart the dev server: `npm run dev`

3. **APISIX config changes:** Regenerate and restart
```bash
cd paapeli-platform
./scripts/generate-apisix-config.sh
docker-compose -f infra/docker-compose/docker-compose.yml restart apisix
```

## Production Deployment

For production, you'll want to:

1. Build the frontend: `npm run build` (in paapeli-MainPage)
2. Serve the built files from a web server (Nginx, Apache, or CDN)
3. Update APISIX to route to your production frontend URL
4. Use HTTPS with proper SSL certificates
5. Update `VITE_API_BASE_URL` to your production API domain

## API Integration

The frontend uses a centralized API configuration in `src/lib/api.ts`:

```typescript
import { getApiUrl } from "@/lib/api";

// Make API calls
const response = await fetch(getApiUrl("/api/v1/devices"), {
  headers: {
    "Authorization": `Bearer ${token}`,
  },
});
```

This ensures all API calls route through the configured `VITE_API_BASE_URL`.

## Additional Resources

- [Backend README](../paapeli-platform/README.md)
- [Backend API Documentation](http://docs.paapeli.local)
- [APISIX Documentation](https://apisix.apache.org/docs/)
