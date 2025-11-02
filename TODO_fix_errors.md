# TODO: Fix Digital Studio API Calls

## Current Status
- Backend `/api/v1/ai/process-image` endpoint exists and is working
- Frontend sends JSON but backend expects FormData
- This causes "Error removing background/enhancing image/generating mockup" messages

## Tasks
- [x] Update `removeBackground()` method in `web_app/js/digital-studio.js` to use FormData
- [x] Update `enhanceImage()` method in `web_app/js/digital-studio.js` to use FormData
- [x] Update `generateMockup()` method in `web_app/js/digital-studio.js` to use FormData
- [x] Test all Digital Studio operations (remove background, enhance image, generate mockup)
- [x] Verify backend receives correct parameters and returns proper responses
- [x] Check if story generation works when audio is properly recorded
