# React + FastAPI + APISIX + Keycloak Integration

This project demonstrates how to integrate React frontend with a FastAPI backend, secured by Keycloak authentication and routed through Apache APISIX API Gateway.

## Project Structure

- `frontend/` - React application
- `backend/` - FastAPI application with Keycloak integration
- `apisix-config.yaml` - APISIX configuration
- `docker-compose.yml` - Docker Compose setup for all services

## Quick Start

1. Start all services:
   ```bash
   docker compose up
   ```

2. Access the services:
   - React Frontend: http://localhost:3000
   - FastAPI Backend: http://localhost:8000
   - Keycloak Admin Console: http://localhost:8080
   - APISIX Dashboard: http://localhost:9000

## Keycloak Setup

Start Keycloak separately if needed:
```bash
docker run -p 127.0.0.1:8080:8080 \
    -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
    -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
    quay.io/keycloak/keycloak:26.4.2 start-dev
```

Configure Keycloak with:
- Realm: `myrealm`
- Client ID: `fastapi-client`
- Client Secret: `K5ZIzE9BSlW8jGTwdybvVMkNTcW7hn1K`

## Authentication Flow

Get an access token:
```bash
curl -X POST \
    -d "client_id=fastapi-client" \
    -d "client_secret=K5ZIzE9BSlW8jGTwdybvVMkNTcW7hn1K" \
    -d "grant_type=client_credentials" \
    -d "audience=fastapi-client" \
    http://localhost:8080/realms/myrealm/protocol/openid-connect/token
```

Extract the token:
```bash
TOKEN=$(curl -X POST -d "client_id=fastapi-client" -d "grant_type=client_credentials" -d "client_secret=K5ZIzE9BSlW8jGTwdybvVMkNTcW7hn1K" http://localhost:8080/realms/myrealm/protocol/openid-connect/token | jq -r '.access_token')
echo $TOKEN
```

Access protected endpoints:
```bash
curl -X 'GET' 'http://localhost:8000/api/protected' -H "Authorization: Bearer $TOKEN"
```

## Backend Development

See [backend/README.md](backend/README.md) for detailed instructions on setting up the FastAPI backend, including database migrations and development workflow.