# KalaConnect

A web application for AI-powered media processing and product creation using webcam uploads.

**Live Demo**: [https://genai-9bcd4.web.app/#](https://genai-9bcd4.web.app/#)

## Current Status

**Hackathon Implementation Complete**: The project has successfully implemented multiple digital marketing and marketplace features as part of a hackathon. Frontend screens, backend APIs, and basic functionality have been developed with mock data integration.

**Ongoing Cleanup**: Currently streamlining the application to focus on 4 core features: Story Weaver, Digital Studio, Trend Weaver, and Market Navigator. Removing non-essential features to improve maintainability and user experience.

**VertexAI Temporarily Unavailable**: Due to billing account verification requirements, VertexAI services are currently unavailable. The system falls back to robust mock responses for AI-powered features, ensuring users can still experience all functionality with sample content. Full AI functionality will be restored once billing verification is complete.

## Architecture Overview

- **Frontend**: Web application with Firebase Authentication and webcam capture
- **Backend**: FastAPI service on Cloud Run with media callback API
- **Processing**: Cloud Functions triggered by GCS uploads, using Vertex AI
- **Storage**: Google Cloud Storage for media files, Firestore for metadata
- **Infrastructure**: Terraform-managed GCP resources

## Features

### Core Features
- **Story Weaver (Voice-to-Story Engine)**: Transform artisan voice recordings into compelling marketing stories
- **Digital Studio (Generative Product Photography)**: AI-powered product photo enhancement and mockup generation
- **Trend Weaver (Market & Design Insights)**: Real-time market trends and design recommendations for artisans
- **Market Navigator (AI-Driven Sales & Communication)**: Intelligent sales strategies and customer communication tools

### Additional Features
- **Accessibility**: Added title attributes to all select elements for improved screen reader support and user experience.
- **Multi-Language Support**: Integrated Google Translate API for language selection.
- **Real-time Collaboration**: Firebase-based authentication and data synchronization.

## Project Structure

```
kalaconnect/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── api/media.py    # Media callback endpoint
│   │   ├── auth/firebase.py # Firebase JWT validation
│   │   ├── services/       # GCP service clients
│   │   └── schemas/        # Pydantic models
│   ├── tests/              # Unit tests
│   ├── Dockerfile          # Container definition
│   └── requirements.txt    # Python dependencies
├── functions/              # Cloud Functions for media processing
│   ├── main.py            # GCS trigger entrypoint
│   ├── processor.py       # Media processing orchestrator
│   └── requirements.txt   # Dependencies
├── web_app/               # Web application
│   ├── index.html         # Main HTML page
│   ├── css/
│   │   └── styles.css     # Stylesheets
│   ├── js/
│   │   ├── app.js         # Main app logic
│   │   ├── auth.js        # Firebase authentication
│   │   ├── upload.js      # Webcam capture and upload
│   │   └── media.js       # Media list and details
│   └── firebase-config.js # Firebase configuration
├── terraform/             # Infrastructure as Code
│   ├── main.tf           # GCP resources
│   ├── variables.tf      # Configuration variables
│   ├── outputs.tf        # Output values
│   └── README.md         # Terraform guide
├── scripts/              # Development and deployment scripts
│   ├── start_local.sh    # Local development setup
│   ├── deploy_backend.sh # Backend deployment
│   └── deploy_functions.sh # Functions deployment
├── .github/workflows/    # CI/CD pipelines
└── README.md             # This file
```

## Prerequisites

- Python 3.11+
- Flutter SDK
- Google Cloud SDK (`gcloud`)
- Terraform
- Docker
- GCP Project with billing enabled

## Quick Start

### 1. GCP Setup

```bash
# Authenticate with GCP
gcloud auth login

# Set your project
export PROJECT_ID=your-gcp-project-id
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable pubsub.googleapis.com

# Create Firebase project and download service account key
# Place the key at backend/firebase-service-account.json
```

### 2. Local Development

```bash
# Clone and setup
git clone <repository-url>
cd kalaconnect

# Start local development environment
chmod +x scripts/start_local.sh
./scripts/start_local.sh
```

This will start:
- Firestore emulator on localhost:8080
- FastAPI backend on localhost:8000

### 3. Deploy Infrastructure

```bash
# Deploy Terraform infrastructure
cd terraform
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

### 4. Deploy Services

```bash
# Deploy backend to Cloud Run
chmod +x scripts/deploy_backend.sh
./scripts/deploy_backend.sh

# Deploy Cloud Functions
chmod +x scripts/deploy_functions.sh
./scripts/deploy_functions.sh
```

### 5. Setup Web App

```bash
cd web_app
# Serve locally (you can use any static server)
python -m http.server 8001
# Open browser to http://localhost:8001
```

## API Endpoints

### Backend API

- `POST /api/v1/media-callback` - Receives processed media results from Cloud Functions

### Testing the API

```bash
# Test media callback endpoint
curl -X POST http://localhost:8000/api/v1/media-callback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase-jwt>" \
  -d '{
    "event_id": "test-event-123",
    "gcs_path": "gs://bucket/file.mp4",
    "processed_results": {
      "media_type": "video",
      "create_product": true,
      "generated_description": "Test video"
    }
  }'
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1
GCS_BUCKET_NAME=kalaconnect-media
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FASTAPI_PORT=8000
FIREBASE_AUTH_ISSUER=https://securetoken.google.com/your-project-id
MAX_PROCESSING_COST_INR=830.0
BACKEND_CALLBACK_URL=http://localhost:8000/api/v1/media-callback
```

## Development

### Running Tests

```bash
cd backend
python -m pytest tests/
```

### Code Quality

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Run manually
pre-commit run --all-files
```

### Building Docker Image

```bash
cd backend
docker build -t kalaconnect-backend .
```

## Vertex AI Integration

The system uses Vertex AI for media processing. To set up:

1. Enable Vertex AI API in GCP console
2. Create a service account with Vertex AI access
3. Set environment variables for Vertex AI project and location

**Current Status**: VertexAI services are temporarily unavailable due to billing account verification requirements. The system currently falls back to mock responses for all AI-powered features. Full AI functionality will be restored once billing verification is complete.

**Note**: The current implementation includes fallback mock functions that provide sample responses when Vertex AI is unavailable. Replace with actual Vertex AI API calls for production use once billing is verified.

## Cost Considerations

- Cloud Run: Pay per request and CPU/memory usage
- Cloud Functions: Pay per invocation and compute time
- Vertex AI: Pay per API call and processing time
- Firestore: Pay per read/write operations and storage
- Cloud Storage: Pay per GB stored and transferred

Monitor usage in GCP console and set budgets to avoid unexpected costs.

## Security

- **NEVER commit service account keys to Git!** They are excluded via `.gitignore`
- Firebase JWT validation on all API endpoints
- Service account keys stored in Secret Manager (production) or local files (development)
- No hardcoded secrets in code
- Environment-based configuration
- Store keys securely outside the repository:
  - Firebase service account: Download from Firebase Console → Project Settings → Service Accounts
  - GCP service account: Create in GCP Console → IAM & Admin → Service Accounts
  - Place keys outside repo directory and reference via environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run CI/CD pipeline
5. Submit pull request

## License

[Add your license here]
