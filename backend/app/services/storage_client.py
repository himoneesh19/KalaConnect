from google.cloud import storage
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class StorageClient:
    def __init__(self):
        self.client = storage.Client(project=os.getenv("PROJECT_ID", "turing-goods-475505-f0"))
        self.bucket_name = os.getenv("GCS_BUCKET_NAME", "kalaconnect-media")  # TODO: Set actual bucket name

    def upload_file(self, file_path: str, destination_blob_name: str) -> str:
        """
        Upload a file to GCS bucket.
        """
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(file_path)
        return f"gs://{self.bucket_name}/{destination_blob_name}"

    def download_file(self, blob_name: str, destination_file_path: str):
        """
        Download a file from GCS bucket.
        """
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(blob_name)
        blob.download_to_filename(destination_file_path)

    def delete_file(self, blob_name: str):
        """
        Delete a file from GCS bucket.
        """
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(blob_name)
        blob.delete()

    def get_signed_url(self, blob_name: str, expiration: int = 3600) -> str:
        """
        Generate a signed URL for a blob.
        """
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(blob_name)
        return blob.generate_signed_url(expiration=expiration)

    def get_file_metadata(self, blob_name: str) -> Optional[dict]:
        """
        Get metadata of a file in GCS.
        """
        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(blob_name)
        if blob.exists():
            return {
                "name": blob.name,
                "size": blob.size,
                "content_type": blob.content_type,
                "created": blob.time_created,
                "updated": blob.updated
            }
        return None
