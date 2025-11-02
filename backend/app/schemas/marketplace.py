from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD_OUT = "sold_out"
    DRAFT = "draft"

class ProductCategory(str, Enum):
    TEXTILES = "textiles"
    POTTERY = "pottery"
    JEWELRY = "jewelry"
    WOODWORK = "woodwork"
    METALWORK = "metalwork"
    PAINTING = "painting"
    SCULPTURE = "sculpture"
    BASKETRY = "basketry"
    LEATHERWORK = "leatherwork"
    HOME_DECOR = "home_decor"
    ART = "art"
    OTHER = "other"

class Product(BaseModel):
    id: str
    title: str
    description: str
    price: float
    category: ProductCategory
    artisan_id: str
    artisan_name: str
    images: List[str]
    tags: List[str]
    cultural_context: Optional[Dict[str, Any]] = None
    stock_quantity: Optional[int] = None
    status: ProductStatus = ProductStatus.ACTIVE
    created_at: datetime
    updated_at: datetime

class ProductCreateRequest(BaseModel):
    title: str
    description: str
    price: float
    category: ProductCategory
    images: List[str]
    tags: List[str]
    cultural_context: Optional[Dict[str, Any]] = None
    stock_quantity: Optional[int] = None

class ProductUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[ProductCategory] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    cultural_context: Optional[Dict[str, Any]] = None
    stock_quantity: Optional[int] = None
    status: Optional[ProductStatus] = None

class Conversation(BaseModel):
    id: str
    participants: List[str]
    participant_names: Dict[str, str]
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: Dict[str, int] = {}
    created_at: datetime
    updated_at: datetime

class Message(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_name: str
    content: str
    timestamp: datetime
    is_read: bool = False

class MessageCreateRequest(BaseModel):
    conversation_id: str
    content: str

class PurchaseRequest(BaseModel):
    product_id: str
    quantity: int = 1

class PurchaseResponse(BaseModel):
    purchase_id: str
    product_id: str
    buyer_id: str
    seller_id: str
    amount: float
    status: str
    message: str

class SEOOptimizeRequest(BaseModel):
    description: str
    platform: str

class SEOOptimizeResponse(BaseModel):
    score: int
    keywords: List[str]
    metaTitle: str
    metaDescription: str
    improvedDescription: str

class EmailCampaignRequest(BaseModel):
    campaignType: str
    targetAudience: str

class EmailCampaignResponse(BaseModel):
    subjectSuggestions: List[str]
    emailBody: str
