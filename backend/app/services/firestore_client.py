from google.cloud import firestore
from google.cloud.firestore_v1 import FieldFilter
import os
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class FirestoreClient:
    def __init__(self):
        # Use emulator if set
        emulator_host = os.getenv("FIRESTORE_EMULATOR_HOST")
        if emulator_host:
            os.environ["FIRESTORE_EMULATOR_HOST"] = emulator_host

        # Skip client initialization during testing
        if os.getenv("TESTING"):
            self.client = None
        else:
            self.client = firestore.AsyncClient(project=os.getenv("PROJECT_ID", "turing-goods-475505-f0"))

    async def upsert_document(self, collection: str, document_id: str, data: Dict[str, Any]) -> str:
        """
        Upsert a document in the specified collection.
        """
        if self.client is None:
            return document_id  # Mock return for testing
        doc_ref = self.client.collection(collection).document(document_id)
        await doc_ref.set(data, merge=True)
        return document_id

    async def create_document(self, collection: str, data: Dict[str, Any]) -> str:
        """
        Create a new document in the specified collection.
        """
        if self.client is None:
            return "mock_doc_id"  # Mock return for testing
        doc_ref = self.client.collection(collection).document()
        await doc_ref.set(data)
        return doc_ref.id

    async def get_document(self, collection: str, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a document by ID.
        """
        if self.client is None:
            return None  # Mock return for testing
        doc_ref = self.client.collection(collection).document(document_id)
        doc = await doc_ref.get()
        return doc.to_dict() if doc.exists else None

    async def query_documents(self, collection: str, field: str, op_string: str, value: Any) -> list:
        """
        Query documents in a collection.
        """
        if self.client is None:
            return []  # Mock return for testing
        query = self.client.collection(collection).where(filter=FieldFilter(field, op_string, value))
        docs = query.stream()
        return [doc.to_dict() async for doc in docs]

    def get_timestamp(self):
        """
        Get current Firestore timestamp.
        """
        return firestore.SERVER_TIMESTAMP
