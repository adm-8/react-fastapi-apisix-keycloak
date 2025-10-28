# FastAPI Backend

This is the backend service for the React + APISIX + Keycloak + FastAPI integration.

## Features

- Protected API endpoints that require Keycloak authentication
- JWT token validation
- Health check endpoint
- User information endpoint

## Endpoints

- `GET /` - Public endpoint to check if the service is running
- `GET /health` - Health check endpoint
- `GET /api/protected` - Protected endpoint that requires authentication
- `GET /api/user-info` - Protected endpoint that returns user information

## Configuration

The application can be configured using the following environment variables:

- `KEYCLOAK_SERVER_URL` - Keycloak server URL (default: http://keycloak:8080)
- `KEYCLOAK_REALM` - Keycloak realm (default: myrealm)
- `KEYCLOAK_CLIENT_ID` - Keycloak client ID (default: fastapi-client)
- `KEYCLOAK_CLIENT_SECRET` - Keycloak client secret (default: your-client-secret)

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Docker

To build and run the Docker image:

```bash
docker build -t fastapi-backend .
docker run -p 8000:8000 fastapi-backend
