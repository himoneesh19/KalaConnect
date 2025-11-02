from fastapi import APIRouter, Depends, HTTPException, Query
from ..auth.firebase import verify_firebase_token
from ..services.firestore_client import FirestoreClient
from ..services.vertex_client import VertexClient
from ..schemas.marketplace import (
    Product, ProductCreateRequest, ProductUpdateRequest,
    Conversation, Message, MessageCreateRequest,
    PurchaseRequest, PurchaseResponse,
    SEOOptimizeRequest, SEOOptimizeResponse,
    EmailCampaignRequest, EmailCampaignResponse
)
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# Mock data for demonstration
MOCK_PRODUCTS = [
    {
        "id": "prod_1",
        "title": "Handwoven Kanjeevaram Silk Saree",
        "description": "Authentic South Indian silk saree with traditional temple border designs, handwoven by master artisans in Kanchipuram.",
        "price": 25000.0,
        "category": "textiles",
        "artisan_id": "artisan_1",
        "artisan_name": "Rama Krishnan",
        "images": ["/api/placeholder/400/400", "/api/placeholder/400/400"],
        "tags": ["silk", "saree", "traditional", "south_india", "temple_design"],
        "cultural_context": {
            "region": "south_india",
            "tradition": "kanjeevaram_weaving",
            "materials": ["mulberry_silk", "gold_zari"]
        },
        "stock_quantity": 5,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_2",
        "title": "Blue Pottery Vase",
        "description": "Handcrafted ceramic vase with intricate blue glaze patterns, inspired by Jaipur's royal heritage.",
        "price": 3200.0,
        "category": "pottery",
        "artisan_id": "artisan_2",
        "artisan_name": "Meera Sharma",
        "images": ["/api/placeholder/400/400"],
        "tags": ["pottery", "ceramic", "blue_glaze", "rajasthan", "handcrafted"],
        "cultural_context": {
            "region": "north_india",
            "tradition": "jaipur_blue_pottery",
            "materials": ["clay", "copper_sulfate"]
        },
        "stock_quantity": 12,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_3",
        "title": "Silver Kundan Jewelry Set",
        "description": "Traditional Rajasthani silver jewelry with kundan work, featuring intricate gold foil patterns.",
        "price": 18500.0,
        "category": "jewelry",
        "artisan_id": "artisan_3",
        "artisan_name": "Vijay Singh",
        "images": ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
        "tags": ["silver", "kundan", "jewelry", "rajasthan", "traditional"],
        "cultural_context": {
            "region": "north_india",
            "tradition": "kundan_jewelry",
            "materials": ["silver", "gold_foil", "gems"]
        },
        "stock_quantity": 3,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_4",
        "title": "Madhubani Painting on Handmade Paper",
        "description": "Traditional Mithila painting depicting folk tales and nature, created on handmade paper using natural colors.",
        "price": 4500.0,
        "category": "painting",
        "artisan_id": "artisan_4",
        "artisan_name": "Priya Kumari",
        "images": ["/api/placeholder/400/400"],
        "tags": ["madhubani", "painting", "bihar", "folk_art", "handmade_paper"],
        "cultural_context": {
            "region": "east_india",
            "tradition": "madhubani_painting",
            "materials": ["handmade_paper", "natural_colors", "brush"]
        },
        "stock_quantity": 8,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_5",
        "title": "Rosewood Carved Elephant Figurine",
        "description": "Intricately carved rosewood elephant figurine showcasing traditional Kerala wood carving craftsmanship.",
        "price": 8500.0,
        "category": "woodwork",
        "artisan_id": "artisan_5",
        "artisan_name": "Thomas Mathew",
        "images": ["/api/placeholder/400/400", "/api/placeholder/400/400"],
        "tags": ["woodwork", "elephant", "rosewood", "kerala", "carving"],
        "cultural_context": {
            "region": "south_india",
            "tradition": "kerala_wood_carving",
            "materials": ["rosewood", "traditional_tools"]
        },
        "stock_quantity": 6,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_6",
        "title": "Banarasi Brocade Cushion Covers",
        "description": "Luxurious brocade cushion covers with zari work, featuring traditional Banarasi motifs and patterns.",
        "price": 3200.0,
        "category": "textiles",
        "artisan_id": "artisan_6",
        "artisan_name": "Anjali Gupta",
        "images": ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
        "tags": ["brocade", "cushion", "banarasi", "zari", "home_decor"],
        "cultural_context": {
            "region": "north_india",
            "tradition": "banarasi_brocade",
            "materials": ["silk", "gold_zari", "cotton"]
        },
        "stock_quantity": 15,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_7",
        "title": "Dhokra Brass Tribal Figure",
        "description": "Ancient lost-wax casting technique brass figure representing tribal deities, from the Bastar region.",
        "price": 6800.0,
        "category": "metalwork",
        "artisan_id": "artisan_7",
        "artisan_name": "Rajesh Kumar",
        "images": ["/api/placeholder/400/400"],
        "tags": ["dhokra", "brass", "tribal", "chhattisgarh", "lost_wax"],
        "cultural_context": {
            "region": "central_india",
            "tradition": "dhokra_art",
            "materials": ["brass", "beeswax", "clay"]
        },
        "stock_quantity": 4,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_8",
        "title": "Pattachitra Palm Leaf Painting",
        "description": "Traditional Orissa palm leaf painting depicting mythological stories with natural colors.",
        "price": 2800.0,
        "category": "painting",
        "artisan_id": "artisan_8",
        "artisan_name": "Suresh Patnaik",
        "images": ["/api/placeholder/400/400"],
        "tags": ["pattachitra", "palm_leaf", "orissa", "mythology", "natural_colors"],
        "cultural_context": {
            "region": "east_india",
            "tradition": "pattachitra_art",
            "materials": ["palm_leaf", "natural_pigments", "brush"]
        },
        "stock_quantity": 10,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_9",
        "title": "Kashmiri Papier Mâché Box",
        "description": "Decorative papier mâché box with intricate gold leaf work, a specialty of Kashmiri craftsmanship.",
        "price": 4200.0,
        "category": "other",
        "artisan_id": "artisan_9",
        "artisan_name": "Farooq Ahmed",
        "images": ["/api/placeholder/400/400", "/api/placeholder/400/400"],
        "tags": ["papier_mache", "kashmir", "gold_leaf", "decorative", "box"],
        "cultural_context": {
            "region": "north_india",
            "tradition": "kashmiri_papier_mache",
            "materials": ["paper", "glue", "gold_leaf"]
        },
        "stock_quantity": 7,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": "prod_10",
        "title": "Warli Tribal Wall Hanging",
        "description": "Handpainted Warli tribal art on cotton fabric, depicting daily life and nature in traditional Warli style.",
        "price": 1800.0,
        "category": "painting",
        "artisan_id": "artisan_10",
        "artisan_name": "Maya Desai",
        "images": ["/api/placeholder/400/400"],
        "tags": ["warli", "tribal", "maharashtra", "wall_hanging", "cotton"],
        "cultural_context": {
            "region": "west_india",
            "tradition": "warli_art",
            "materials": ["cotton_fabric", "natural_colors"]
        },
        "stock_quantity": 12,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

MOCK_CONVERSATIONS = [
    {
        "id": "conv_1",
        "participants": ["user_1", "artisan_1"],
        "participant_names": {"user_1": "Customer", "artisan_1": "Rama Krishnan"},
        "last_message": "Thank you for your interest in the Kanjeevaram saree!",
        "last_message_time": datetime.now(),
        "unread_count": {"user_1": 0, "artisan_1": 1},
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

MOCK_MESSAGES = [
    {
        "id": "msg_1",
        "conversation_id": "conv_1",
        "sender_id": "artisan_1",
        "sender_name": "Rama Krishnan",
        "content": "Thank you for your interest in the Kanjeevaram saree!",
        "timestamp": datetime.now(),
        "is_read": False
    }
]

@router.get("/products", response_model=List[Product])
async def get_products(
    search: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Product category"),
    priceRange: Optional[str] = Query(None, description="Price range (e.g., '0-500', '500-2000')"),
    limit: int = Query(20, description="Maximum number of products to return")
):
    """
    Get products with optional filtering.
    """
    try:
        products = MOCK_PRODUCTS.copy()

        # Apply filters
        if search:
            search_lower = search.lower()
            products = [p for p in products if
                       search_lower in p["title"].lower() or
                       search_lower in p["description"].lower() or
                       any(search_lower in tag for tag in p["tags"])]

        if category:
            products = [p for p in products if p["category"] == category]

        if priceRange:
            if priceRange == "0-500":
                products = [p for p in products if p["price"] <= 500]
            elif priceRange == "500-2000":
                products = [p for p in products if 500 < p["price"] <= 2000]
            elif priceRange == "2000-5000":
                products = [p for p in products if 2000 < p["price"] <= 5000]
            elif priceRange == "5000+":
                products = [p for p in products if p["price"] > 5000]

        # Limit results
        products = products[:limit]

        return [Product(**p) for p in products]

    except Exception as e:
        logger.error(f"Error retrieving products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve products")

@router.post("/products", response_model=Dict[str, str])
async def create_product(
    request: ProductCreateRequest,
    user: Dict[str, Any] = Depends(verify_firebase_token),
    firestore: FirestoreClient = Depends()
):
    """
    Create a new product listing.
    """
    try:
        product_doc = {
            "title": request.title,
            "description": request.description,
            "price": request.price,
            "category": request.category,
            "artisan_id": user["uid"],
            "artisan_name": "Artisan Name",  # Would get from artisan profile
            "images": request.images,
            "tags": request.tags,
            "cultural_context": request.cultural_context,
            "stock_quantity": request.stock_quantity,
            "status": "active",
            "created_at": firestore.get_timestamp(),
            "updated_at": firestore.get_timestamp()
        }

        product_id = await firestore.create_document("products", product_doc)

        logger.info(f"Product created: {product_id}")
        return {"product_id": product_id, "message": "Product created successfully"}

    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create product")

@router.get("/conversations", response_model=List[Conversation])
async def get_conversations(
    user: Dict[str, Any] = Depends(verify_firebase_token)
):
    """
    Get user's conversations.
    """
    try:
        # In production, filter by user participation
        conversations = MOCK_CONVERSATIONS.copy()
        return [Conversation(**c) for c in conversations]

    except Exception as e:
        logger.error(f"Error retrieving conversations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve conversations")

@router.get("/messages/{conversation_id}", response_model=List[Message])
async def get_messages(
    conversation_id: str,
    user: Dict[str, Any] = Depends(verify_firebase_token)
):
    """
    Get messages for a conversation.
    """
    try:
        messages = [m for m in MOCK_MESSAGES if m["conversation_id"] == conversation_id]
        return [Message(**m) for m in messages]

    except Exception as e:
        logger.error(f"Error retrieving messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve messages")

@router.post("/send-message")
async def send_message(
    request: MessageCreateRequest,
    user: Dict[str, Any] = Depends(verify_firebase_token),
    firestore: FirestoreClient = Depends()
):
    """
    Send a message in a conversation.
    """
    try:
        message_doc = {
            "conversation_id": request.conversation_id,
            "sender_id": user["uid"],
            "sender_name": "User Name",  # Would get from user profile
            "content": request.content,
            "timestamp": firestore.get_timestamp(),
            "is_read": False
        }

        message_id = await firestore.create_document("messages", message_doc)

        # Update conversation's last message
        await firestore.update_document("conversations", request.conversation_id, {
            "last_message": request.content,
            "last_message_time": firestore.get_timestamp(),
            "updated_at": firestore.get_timestamp()
        })

        return {"message_id": message_id, "message": "Message sent successfully"}

    except Exception as e:
        logger.error(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send message")

@router.post("/purchase", response_model=PurchaseResponse)
async def initiate_purchase(
    request: PurchaseRequest,
    user: Dict[str, Any] = Depends(verify_firebase_token),
    firestore: FirestoreClient = Depends()
):
    """
    Initiate a product purchase.
    """
    try:
        # Get product details
        product = next((p for p in MOCK_PRODUCTS if p["id"] == request.product_id), None)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        purchase_doc = {
            "product_id": request.product_id,
            "buyer_id": user["uid"],
            "seller_id": product["artisan_id"],
            "amount": product["price"] * request.quantity,
            "quantity": request.quantity,
            "status": "initiated",
            "created_at": firestore.get_timestamp()
        }

        purchase_id = await firestore.create_document("purchases", purchase_doc)

        return PurchaseResponse(
            purchase_id=purchase_id,
            product_id=request.product_id,
            buyer_id=user["uid"],
            seller_id=product["artisan_id"],
            amount=purchase_doc["amount"],
            status="initiated",
            message="Purchase initiated successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error initiating purchase: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initiate purchase")

@router.post("/seo-optimize", response_model=SEOOptimizeResponse)
async def optimize_seo(
    request: SEOOptimizeRequest,
    user: Dict[str, Any] = Depends(verify_firebase_token),
    vertex_client: VertexClient = Depends()
):
    """
    Optimize product description for SEO.
    """
    try:
        # Validate request data
        if not request.description or len(request.description.strip()) == 0:
            raise HTTPException(status_code=422, detail="Description cannot be empty")
        if not request.platform or request.platform not in ["google", "facebook", "instagram", "amazon"]:
            raise HTTPException(status_code=422, detail="Invalid platform. Must be one of: google, facebook, instagram, amazon")

        prompt = f"""
        Analyze this product description for SEO optimization on {request.platform}:

        "{request.description}"

        Provide:
        1. SEO score out of 100
        2. Top 5 relevant keywords for Indian e-commerce
        3. Optimized meta title (under 60 characters)
        4. Optimized meta description (under 160 characters)
        5. Improved product description with better SEO

        Focus on Indian market keywords and search intent.
        """

        analysis = await vertex_client.generate_text(prompt)

        # Mock response for demonstration
        return SEOOptimizeResponse(
            score=85,
            keywords=["handcrafted", "traditional", "artisan", "authentic", "indian handicraft"],
            metaTitle="Handcrafted Traditional Indian Art - Authentic Artisan Products",
            metaDescription="Discover authentic handcrafted traditional Indian art by skilled artisans. Unique cultural heritage products with stories.",
            improvedDescription="Experience the rich heritage of Indian craftsmanship with this authentic handcrafted traditional art piece, created by skilled artisans using age-old techniques passed down through generations."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error optimizing SEO: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to optimize SEO")

@router.post("/generate-email-campaign", response_model=EmailCampaignResponse)
async def generate_email_campaign(
    request: EmailCampaignRequest,
    user: Dict[str, Any] = Depends(verify_firebase_token),
    vertex_client: VertexClient = Depends()
):
    """
    Generate email campaign content.
    """
    try:
        # Validate request data
        if not request.campaignType or request.campaignType not in ["seasonal", "new_arrival", "promotion", "newsletter"]:
            raise HTTPException(status_code=422, detail="Invalid campaign type. Must be one of: seasonal, new_arrival, promotion, newsletter")
        if not request.targetAudience or len(request.targetAudience.strip()) == 0:
            raise HTTPException(status_code=422, detail="Target audience cannot be empty")

        prompt = f"""
        Generate an email campaign for {request.campaignType} targeting {request.targetAudience}.

        Provide:
        1. 3 compelling subject line suggestions
        2. Complete email body content suitable for Indian artisans selling handicrafts

        Make it culturally appropriate and engaging for Indian customers.
        """

        content = await vertex_client.generate_text(prompt)

        # Mock response for demonstration
        subject_suggestions = [
            "Discover Authentic Indian Handicrafts - Made with Love",
            "Traditional Artistry Meets Modern Style",
            "Your Story, Our Craft: Unique Handmade Treasures"
        ]

        email_body = """
        Dear Valued Customer,

        Welcome to our world of authentic Indian handicrafts!

        Each piece in our collection tells a story of tradition, craftsmanship, and cultural heritage. Our skilled artisans pour their heart and soul into creating unique pieces that bring the beauty of Indian art to your home.

        Featured Collection:
        - Handwoven silk sarees with traditional motifs
        - Intricate silver jewelry with kundan work
        - Blue pottery inspired by royal heritage

        Visit our marketplace today and discover the perfect piece that resonates with your soul.

        Warm regards,
        The Artisan Community
        """

        return EmailCampaignResponse(
            subjectSuggestions=subject_suggestions,
            emailBody=email_body.strip()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating email campaign: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate email campaign")
