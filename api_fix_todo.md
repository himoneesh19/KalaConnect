# TODO: Fix API URL Issues in KalaConnect Frontend

## Issues Identified
- Frontend JS files use relative URLs that don't work when frontend and backend are on different ports/domains
- Missing full backend URLs for local development and production
- Need to ensure Authorization headers are included for protected endpoints

## Tasks
- [x] Add API_BASE_URL constant to app.js (http://localhost:8000 for dev)
- [x] Update seo-optimizer.js: Change '/api/v1/seo-optimize' to full URL with Authorization header
- [x] Update email-campaign.js: Change '/api/v1/generate-email-campaign' to full URL with Authorization header
- [x] Update marketplace.js: Change '/api/v1/products' and '/api/v1/purchase' to full URLs (purchase needs auth)
- [x] Update messages.js: Change conversation, message, and send-message endpoints to full URLs with Authorization headers
- [x] Add authentication checks before all protected API calls
- [x] Start local frontend server on port 3000
- [x] Test all updated API calls with authentication flow
- [ ] Update API_BASE_URL for production deployment (Firebase backend URL)

## Testing
- Backend running on http://localhost:8000
- Frontend served on http://localhost:3000
- User logged in via Firebase Auth
- All API calls should succeed with proper URLs and auth headers
