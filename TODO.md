# KalaConnect Feature Cleanup TODO

## Task: Remove all features except the 4 core features
- Story Weaver (Voice-to-Story Engine)
- Digital Studio (Generative Product Photography)
- Trend Weaver (Market & Design Insights)
- Market Navigator (AI-Driven Sales & Communication)

## Steps to Complete:
- [ ] Update web_app/index.html to remove unwanted screen divs
- [ ] Update navigation links in kept screens to only show 4 features
- [ ] Remove script tags for deleted JS files
- [ ] Delete unwanted JS files from web_app/js/
- [ ] Test that app loads with only 4 features

## Files to Remove:
- web_app/js/seo-optimizer.js
- web_app/js/email-campaign.js
- web_app/js/marketplace.js
- web_app/js/messages.js
- web_app/js/upload.js (if not needed)
- web_app/js/media.js (if not needed)

## Screens to Remove from index.html:
- media-list-screen
- upload-screen
- product-detail-screen
- seo-optimizer-screen
- email-campaign-screen
- marketplace-screen
- messages-screen
