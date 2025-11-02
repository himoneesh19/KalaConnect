from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.marketplace import router as marketplace_router
from .api.ai import router as ai_router
import os
from dotenv import load_dotenv

# Load environment variables from .env file in backend directory, overriding system env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'), override=True)

app = FastAPI(title="KalaConnect Backend", version="1.0.0")

# CORS middleware for Flutter web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(marketplace_router, prefix="/api/v1/marketplace")
app.include_router(ai_router, prefix="/api/v1/ai")

@app.get("/")
async def root():
    return {"message": "KalaConnect Backend API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
