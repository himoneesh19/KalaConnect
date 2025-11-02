import functions_framework
import json
import logging
import sys
import os

logger = logging.getLogger(__name__)

# Cloud Event function for GCS triggers
@functions_framework.cloud_event
def gcs_trigger(cloud_event) -> None:
    """
    Cloud Function triggered by GCS finalize events.
    Processes uploaded media files using Vertex AI and other services.
    """
    try:
        # Import processor inside function to avoid cold start issues
        from processor import process_media_event

        # Extract event data
        event_data = cloud_event.data
        bucket_name = event_data["bucket"]
        file_name = event_data["name"]
        event_id = cloud_event["id"]

        logger.info(f"Processing GCS event: bucket={bucket_name}, file={file_name}, event_id={event_id}")

        # Process the media event
        result = process_media_event(bucket_name, file_name, event_id)

        if result["success"]:
            logger.info(f"Successfully processed media: {file_name}")
        else:
            logger.error(f"Failed to process media: {file_name}, error: {result.get('error')}")

    except Exception as e:
        logger.error(f"Error in gcs_trigger: {str(e)}")
        raise  # Re-raise to trigger retry

# HTTP function for API endpoints
@functions_framework.http
def api(request):
    """
    HTTP Cloud Function for API endpoints.
    """
    try:
        # Import FastAPI and backend modules inside function to avoid cold start issues
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        from dotenv import load_dotenv

        # Load environment variables
        load_dotenv()

        # Import backend modules
        from backend.app.api.media import router as media_router
        from backend.app.api.marketplace import router as marketplace_router

        # Create FastAPI app
        app = FastAPI(title="KalaConnect Backend", version="1.0.0")

        # CORS middleware for Flutter web app
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # TODO: Restrict to specific origins in production
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        app.include_router(media_router, prefix="/api/v1")
        app.include_router(marketplace_router, prefix="/api/v1")

        @app.get("/")
        async def root():
            return {"message": "KalaConnect Backend API"}

        # Convert Flask request to ASGI for FastAPI
        from fastapi.middleware.wsgi import WSGIMiddleware
        from flask import Flask

        flask_app = Flask(__name__)
        flask_app.wsgi_app = WSGIMiddleware(app)

        with flask_app.test_request_context():
            return flask_app.full_dispatch_request()

    except Exception as e:
        logger.error(f"Error in API function: {str(e)}")
        return json.dumps({"error": "Internal server error"}), 500
