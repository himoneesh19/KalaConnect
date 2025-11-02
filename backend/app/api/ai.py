from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from ..auth.firebase import verify_firebase_token
from ..services.vertex_client import VertexClient
from typing import Dict, Any, Optional
import logging
import json

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate-story")
async def generate_story(
    audio_transcription: str = Form(...),
    language: str = Form("en"),
    artisan_id: Optional[str] = Form(None),
    cultural_context: str = Form("{}"),
    vertex_client: VertexClient = Depends()
):
    """
    Generate a culturally-aware story from audio transcription.
    """
    try:
        # Parse cultural context
        try:
            context_dict = json.loads(cultural_context)
        except json.JSONDecodeError:
            context_dict = {}

        # Generate story using VertexAI
        story = await vertex_client.generate_story_from_transcription(
            transcription=audio_transcription,
            language=language,
            cultural_context=context_dict
        )

        return {
            "story": story,
            "cultural_context": context_dict,
            "language": language
        }

    except Exception as e:
        logger.error(f"Error generating story: {str(e)}")
        # Return mock response if AI fails
        mock_story = f"""
        Once upon a time in the vibrant lands of India, there lived a skilled artisan who poured their heart into creating beautiful handcrafted treasures. With each piece, they told stories of tradition, culture, and craftsmanship that had been passed down through generations.

        The artisan's work reflected the rich heritage of Indian art, blending ancient techniques with contemporary sensibilities. Every creation was a testament to the dedication and skill that goes into preserving cultural traditions while adapting to modern times.

        Through their craft, the artisan connected with people from all walks of life, sharing the beauty and significance of Indian handicrafts with the world. Each piece carried not just beauty, but also the soul and spirit of Indian craftsmanship.
        """

        return {
            "story": mock_story.strip(),
            "cultural_context": {},
            "language": language,
            "note": "AI service temporarily unavailable, showing sample story"
        }

@router.post("/transcribe-audio")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("en"),
    user: Dict[str, Any] = Depends(verify_firebase_token),
    vertex_client: VertexClient = Depends()
):
    """
    Transcribe audio file to text.
    """
    try:
        # Save uploaded file temporarily
        import tempfile
        import os

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Transcribe using VertexAI
            transcription = await vertex_client.transcribe_audio(
                audio_path=temp_file_path,
                language=language
            )

            return {
                "transcription": transcription,
                "language": language
            }

        finally:
            # Clean up temp file
            os.unlink(temp_file_path)

    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        # Return mock transcription if AI fails
        mock_transcriptions = {
            "en": "I am a skilled artisan who creates beautiful handcrafted items. My work tells stories of my culture and heritage.",
            "hi": "मैं एक कुशल कारीगर हूं जो सुंदर हस्तनिर्मित वस्तुएं बनाता हूं। मेरा काम मेरी संस्कृति और विरासत की कहानियां सुनाता है।",
            "te": "నేను అందమైన చేతితయారు వస్తువులను తయారు చేసే నైపుణ్యం ఉన్న కారిగరుడిని. నా పని నా సంస్కృతి మరియు వారసత్వం కథలను చెబుతుంది.",
            "ta": "நான் அழகான கைவினைப் பொருட்களை உருவாக்கும் திறமையான கைவினைஞர். என் வேலை என் கலாச்சாரம் மற்றும் மரபின் கதைகளைச் சொல்கிறது."
        }

        return {
            "transcription": mock_transcriptions.get(language, mock_transcriptions["en"]),
            "language": language,
            "note": "AI transcription service temporarily unavailable, showing sample transcription"
        }

@router.post("/process-image")
async def process_image(
    image_url: str = Form(...),
    operation: str = Form(...),
    artisan_id: Optional[str] = Form(None),
    user: Dict[str, Any] = Depends(verify_firebase_token),
    vertex_client: VertexClient = Depends()
):
    """
    Process images for digital studio operations: remove_bg, enhance, generate_mockup.
    """
    try:
        if operation not in ['remove_bg', 'enhance', 'generate_mockup']:
            raise HTTPException(status_code=400, detail=f"Unsupported operation: {operation}")

        # Use Vertex AI Vision for image processing
        result = await vertex_client.process_image(image_url, operation)

        return {
            "result": result,
            "operation": operation,
            "artisan_id": artisan_id
        }

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")

        # Check if it's a connectivity/unreachability issue
        error_message = str(e).lower()
        is_unreachable = any(keyword in error_message for keyword in [
            'connection', 'timeout', 'unreachable', 'network', 'dns', 'resolve',
            'vertex', 'google', 'api', 'service unavailable', '502', '503', '504'
        ])

        if is_unreachable:
            logger.warning("AI service appears unreachable, returning offline simulation")
            mock_result = vertex_client._get_mock_image_response(image_url, operation)
            return {
                "result": mock_result,
                "operation": operation,
                "artisan_id": artisan_id,
                "note": "AI service currently unreachable, using offline simulation",
                "status": "offline_simulation"
            }
        else:
            # For other types of errors, still return mock but with different messaging
            mock_result = vertex_client._get_mock_image_response(image_url, operation)
            return {
                "result": mock_result,
                "operation": operation,
                "artisan_id": artisan_id,
                "note": "AI service temporarily unavailable, using simulation",
                "status": "service_error"
            }

@router.post("/generate-market-insights")
async def generate_market_insights(
    category: str = Form(...),
    region: str = Form("india"),
    artisan_context: str = Form("{}"),
    user: Dict[str, Any] = Depends(verify_firebase_token),
    vertex_client: VertexClient = Depends()
):
    """
    Generate market insights for artisan crafts.
    """
    try:
        # Parse artisan context
        try:
            context_dict = json.loads(artisan_context)
        except json.JSONDecodeError:
            context_dict = {}

        # Generate insights using VertexAI
        insights = await vertex_client.generate_market_insights(
            category=category,
            region=region,
            artisan_context=context_dict
        )

        return {
            "insights": insights,
            "category": category,
            "region": region
        }

    except Exception as e:
        logger.error(f"Error generating market insights: {str(e)}")
        # Return mock insights if AI fails
        mock_insights = f"""
        Market Insights for {category.title()} Crafts in {region.title()}:

        CURRENT MARKET TRENDS:
        - Growing demand for authentic, handcrafted products
        - Increasing interest in sustainable and ethical craftsmanship
        - Rising popularity of cultural storytelling through products

        PRICING STRATEGIES:
        - Premium pricing for authentic, heritage products
        - Value-based pricing that reflects artisan skill and materials
        - Competitive positioning against mass-produced alternatives

        CULTURAL CONSIDERATIONS:
        - Strong emphasis on preserving traditional techniques
        - Growing appreciation for cultural heritage and authenticity
        - Interest in connecting consumers with artisan stories

        GROWTH OPPORTUNITIES:
        - Online marketplaces and digital platforms
        - International export potential
        - Collaborations with modern designers and brands

        COMPETITIVE LANDSCAPE:
        - Differentiation through authenticity and heritage
        - Building direct relationships with customers
        - Focus on unique, one-of-a-kind pieces
        """

        return {
            "insights": mock_insights.strip(),
            "category": category,
            "region": region,
            "note": "AI service temporarily unavailable, showing sample insights"
        }
