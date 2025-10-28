from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import requests
import logging

# Import configuration
from config import KeycloakConfig

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FastAPI Backend", description="Backend API for React + APISIX + Keycloak integration")

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to get Keycloak public key
def get_keycloak_public_key():
    try:
        url = KeycloakConfig.get_public_key_url()
        response = requests.get(url)
        response.raise_for_status()
        public_key = response.json()["public_key"]
        return "-----BEGIN PUBLIC KEY-----\n" + public_key + "\n-----END PUBLIC KEY-----"
    except Exception as e:
        logger.error(f"Error fetching Keycloak public key: {e}")
        raise

# Function to verify JWT token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        public_key = get_keycloak_public_key()
        # Decode and verify the token
        payload = jwt.decode(
            token,
            public_key,
            algorithms=KeycloakConfig.ALGORITHMS,
            audience="account"
        )
        return payload
    except JWTError as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Error during token verification: {e}")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Public endpoint
@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}

# Public health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Protected endpoint that requires authentication
@app.get("/api/protected")
async def protected_route(user: dict = Depends(verify_token)):
    return {
        "message": "Access granted to protected resource",
        "user": user
    }

# Another protected endpoint example
@app.get("/api/user-info")
async def user_info(user: dict = Depends(verify_token)):
    return {
        "message": "User information retrieved successfully",
        "user_id": user.get("sub"),
        "username": user.get("preferred_username"),
        "email": user.get("email"),
        "roles": user.get("realm_access", {}).get("roles", [])
    }

# Catch-all middleware for debugging (optional)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
