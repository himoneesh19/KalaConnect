from fastapi import HTTPException, Request
from firebase_admin import auth, credentials, initialize_app
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
firebase_service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
if not os.getenv("TESTING"):  # Skip initialization during tests
    if firebase_service_account_path:
        cred = credentials.Certificate(firebase_service_account_path)
        initialize_app(cred)
    else:
        # Use Application Default Credentials (ADC) for GCP environments
        initialize_app()

async def verify_firebase_token(request: Request) -> Dict[str, Any]:
    """
    Verify Firebase JWT token from Authorization header.
    Returns decoded token payload if valid.
    """
    # Skip authentication in testing mode
    if os.getenv("TESTING"):
        return {"uid": "test_user", "email": "test@example.com"}

    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        # Extract token from "Bearer <token>"
        token = authorization.split(" ")[1] if " " in authorization else authorization

        # Verify the token
        decoded_token = auth.verify_id_token(token)

        # Optional: Check issuer
        expected_issuer = os.getenv("FIREBASE_AUTH_ISSUER", "https://securetoken.google.com/genai-9bcd4")
        if decoded_token.get("iss") != expected_issuer:
            raise HTTPException(status_code=401, detail="Invalid token issuer")

        return decoded_token

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail="Token verification failed")
