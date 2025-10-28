import os

class KeycloakConfig:
    """Keycloak configuration settings"""
    
    # Keycloak server URL
    SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080")
    
    # Realm name
    REALM = os.getenv("KEYCLOAK_REALM", "myrealm")
    
    # Client ID
    CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "fastapi-client")
    
    # Client secret (should be loaded from environment variables in production)
    CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "your-client-secret")
    
    # Token validation settings
    ALGORITHMS = ["RS256"]
    
    # Public key URL
    @classmethod
    def get_public_key_url(cls):
        return f"{cls.SERVER_URL}/realms/{cls.REALM}"
    
    # Well-known configuration URL
    @classmethod
    def get_well_known_url(cls):
        return f"{cls.SERVER_URL}/realms/{cls.REALM}/.well-known/openid-configuration"
