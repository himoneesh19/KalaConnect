// Market Navigator Module - AI-Driven Sales & Communication
class MarketNavigator {
    constructor() {
        this.pricingHistory = [];
        this.chatHistory = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const calculateBtn = document.getElementById('calculate-price');
        const sendChatBtn = document.getElementById('send-chat');

        if (calculateBtn) calculateBtn.addEventListener('click', () => this.calculatePrice());
        if (sendChatBtn) sendChatBtn.addEventListener('click', (e) => this.sendChatMessage(e));
    }

    async calculatePrice() {
        const productName = document.getElementById('product-name').value.trim();
        const basePrice = parseFloat(document.getElementById('base-price').value);
        const targetMarket = document.getElementById('target-market').value;

        if (!productName || isNaN(basePrice) || basePrice <= 0) {
            this.showPricingStatus('Please enter valid product name and base price.', 'error');
            return;
        }

        try {
            this.showPricingStatus('Calculating optimal price...', 'info');

            // For demo purposes, simulate price calculation
            // In production, this would call your backend API
            setTimeout(() => {
                const pricing = this.calculateMockPrice(productName, basePrice, targetMarket);
                this.displayPricingResults(pricing);
                this.showPricingStatus('Pricing calculated successfully!', 'success');
            }, 1500);

        } catch (error) {
            console.error('Error calculating price:', error);
            this.showPricingStatus('Error calculating price. Please try again.', 'error');
        }
    }

    calculateMockPrice(productName, basePrice, targetMarket) {
        // Mock pricing algorithm for Indian markets - in production, this would use real market data
        const marketMultipliers = {
            local: 1.3,      // Local Indian markets: 30% premium for direct artisan relationships
            national: 1.8,   // National distribution: 80% premium for logistics and marketing
            international: 2.5  // International: 150% premium for export duties and global positioning
        };

        const multiplier = marketMultipliers[targetMarket] || 1.3;
        const suggestedPrice = Math.round(basePrice * multiplier);

        // Calculate price range for Indian market context
        const minPrice = Math.round(suggestedPrice * 0.85);  // 15% below for competitive positioning
        const maxPrice = Math.round(suggestedPrice * 1.4);   // 40% above for premium positioning

        return {
            productName,
            basePrice,
            targetMarket,
            suggestedPrice,
            priceRange: { min: minPrice, max: maxPrice },
            reasoning: this.generatePricingReasoning(productName, targetMarket),
            competitors: this.generateCompetitorPrices(suggestedPrice)
        };
    }

    generatePricingReasoning(productName, targetMarket) {
        const reasonings = {
            local: `${productName} in local Indian markets typically commands a 30% premium due to direct artisan relationships, cultural authenticity, and immediate availability through local haats and markets.`,
            national: `For national distribution across India, ${productName} pricing should account for interstate logistics, GST considerations, marketing through Indian e-commerce platforms, and competition from regional artisans.`,
            international: `International pricing for ${productName} must consider INR to foreign currency conversion, export duties, shipping costs, and positioning as authentic Indian handicraft in global markets.`
        };

        return reasonings[targetMarket] || reasonings.local;
    }

    generateCompetitorPrices(suggestedPrice) {
        // Mock competitor analysis for Indian market
        return [
            { name: 'Local Artisan Co-op', price: Math.round(suggestedPrice * 0.9), position: 'Budget option' },
            { name: 'Premium Handicrafts India', price: Math.round(suggestedPrice * 1.1), position: 'Premium option' },
            { name: 'Traditional Crafts Hub', price: Math.round(suggestedPrice * 0.95), position: 'Value competitor' }
        ];
    }

    displayPricingResults(pricing) {
        const resultsDiv = document.getElementById('pricing-results');
        if (!resultsDiv) return;

        resultsDiv.innerHTML = `
            <div class="pricing-card">
                <h3>${pricing.productName}</h3>
                <div class="price-display">
                    <div class="suggested-price">
                        <span class="label">Suggested Price:</span>
                        <span class="price">₹${pricing.suggestedPrice}</span>
                    </div>
                    <div class="price-range">
                        <span class="label">Price Range:</span>
                        <span class="range">₹${pricing.priceRange.min} - ₹${pricing.priceRange.max}</span>
                    </div>
                </div>
                <div class="pricing-reasoning">
                    <h4>Market Analysis</h4>
                    <p>${pricing.reasoning}</p>
                </div>
                <div class="competitor-analysis">
                    <h4>Competitor Pricing</h4>
                    <div class="competitor-list">
                        ${pricing.competitors.map(comp => `
                            <div class="competitor-item">
                                <span class="comp-name">${comp.name}</span>
                                <span class="comp-price">₹${comp.price}</span>
                                <span class="comp-position">${comp.position}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    async sendChatMessage(event) {
        event.preventDefault();

        const chatInput = document.getElementById('chat-input');
        const targetLanguage = document.getElementById('target-language').value;
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addChatMessage(message, 'user', 'en');

        // Clear input
        chatInput.value = '';

        try {
            // For demo purposes, simulate translation and response
            // In production, this would call a translation API
            setTimeout(() => {
                const translatedMessage = this.mockTranslate(message, 'en', targetLanguage);
                this.addChatMessage(translatedMessage, 'translated', targetLanguage);

                // Simulate AI response
                setTimeout(() => {
                    const aiResponse = this.generateMockResponse(message, targetLanguage);
                    this.addChatMessage(aiResponse, 'ai', targetLanguage);
                }, 1000);
            }, 500);

        } catch (error) {
            console.error('Error sending chat message:', error);
            this.addChatMessage('Error processing message. Please try again.', 'error', 'en');
        }
    }

    mockTranslate(text, fromLang, toLang) {
        // Mock translation - in production, use Google Translate API or similar
        if (fromLang === toLang) return text;

        const translations = {
            'hi': {
                'Hello': 'नमस्ते',
                'How are you?': 'आप कैसे हैं?',
                'Thank you': 'धन्यवाद',
                'Please': 'कृपया',
                'Yes': 'हाँ',
                'No': 'नहीं'
            },
            'es': {
                'Hello': 'Hola',
                'How are you?': '¿Cómo estás?',
                'Thank you': 'Gracias',
                'Please': 'Por favor',
                'Yes': 'Sí',
                'No': 'No'
            },
            'fr': {
                'Hello': 'Bonjour',
                'How are you?': 'Comment allez-vous?',
                'Thank you': 'Merci',
                'Please': 'S\'il vous plaît',
                'Yes': 'Oui',
                'No': 'Non'
            },
            'de': {
                'Hello': 'Hallo',
                'How are you?': 'Wie geht es Ihnen?',
                'Thank you': 'Danke',
                'Please': 'Bitte',
                'Yes': 'Ja',
                'No': 'Nein'
            }
        };

        // Simple mock translation - check for exact matches
        const langTranslations = translations[toLang] || {};
        return langTranslations[text] || `[Translated to ${toLang}]: ${text}`;
    }

    generateMockResponse(userMessage, language) {
        const responses = {
            'en': [
                "I'd be happy to help you with that product!",
                "That's a great choice! Let me provide more details.",
                "Thank you for your interest. How can I assist you further?",
                "I understand your requirements. Let me check availability."
            ],
            'hi': [
                "मैं आपकी मदद करने में खुशी होगी!",
                "यह एक बढ़िया चुनाव है! मैं और विवरण प्रदान करता हूं।",
                "आपकी रुचि के लिए धन्यवाद। मैं आपकी आगे कैसे मदद कर सकता हूं?",
                "मैं आपकी आवश्यकताओं को समझता हूं। उपलब्धता जांचने दें।"
            ],
            'es': [
                "¡Me encantaría ayudarte con ese producto!",
                "¡Esa es una gran elección! Déjame proporcionarte más detalles.",
                "Gracias por tu interés. ¿Cómo puedo ayudarte más?",
                "Entiendo tus requerimientos. Déjame verificar la disponibilidad."
            ],
            'fr': [
                "Je serais ravi de vous aider avec ce produit !",
                "C'est un excellent choix ! Laissez-moi vous fournir plus de détails.",
                "Merci pour votre intérêt. Comment puis-je vous aider davantage ?",
                "Je comprends vos besoins. Laissez-moi vérifier la disponibilité."
            ],
            'de': [
                "Ich würde mich freuen, Ihnen bei diesem Produkt zu helfen!",
                "Das ist eine großartige Wahl! Lassen Sie mich Ihnen mehr Details geben.",
                "Vielen Dank für Ihr Interesse. Wie kann ich Ihnen weiterhelfen?",
                "Ich verstehe Ihre Anforderungen. Lassen Sie mich die Verfügbarkeit prüfen."
            ]
        };

        const langResponses = responses[language] || responses['en'];
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    addChatMessage(message, type, language) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-${type}`;

        const langNames = {
            'en': 'English',
            'hi': 'हिंदी',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch'
        };

        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-meta">${langNames[language] || language} - ${new Date().toLocaleTimeString()}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showPricingStatus(message, type = 'info') {
        const statusDiv = document.querySelector('#pricing-tool .status');
        if (!statusDiv) {
            const tool = document.querySelector('.pricing-tool');
            if (tool) {
                const newStatus = document.createElement('div');
                newStatus.className = 'status';
                tool.appendChild(newStatus);
            }
        }

        const status = document.querySelector('#pricing-tool .status');
        if (status) {
            status.textContent = message;
            status.className = `status status-${type}`;
        }
    }
}

// Initialize Market Navigator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('market-navigator-screen')) {
        new MarketNavigator();
    }
});
