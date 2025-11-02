// Translation Module - Google Translate Integration
class Translator {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeGoogleTranslate();
    }

    bindEvents() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        }
    }

    initializeGoogleTranslate() {
        // Initialize Google Translate with 22 Indian languages
        window.googleTranslateElementInit = () => {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,as,bn,bho,doi,gu,gon,mai,ml,mni,mr,ne,or,pa,sa,sd,si,ta,te,ur',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');

            // Hide the default Google Translate widget
            setTimeout(() => {
                const widget = document.getElementById('google_translate_element');
                if (widget) {
                    widget.style.display = 'none';
                }
            }, 1000);
        };
    }

    changeLanguage(languageCode) {
        this.currentLanguage = languageCode;

        // Use Google Translate API to change language
        if (window.google && window.google.translate) {
            const translateElement = document.querySelector('.goog-te-combo');
            if (translateElement) {
                translateElement.value = languageCode;
                translateElement.dispatchEvent(new Event('change'));
            }
        }

        // Store language preference
        localStorage.setItem('kalaConnect_language', languageCode);

        // Update UI language
        this.updateUILanguage(languageCode);
    }

    updateUILanguage(language) {
        // Update static text elements based on language
        const translations = {
            'en': {
                'login-title': 'KalaConnect',
                'login-subtitle': 'AI-Powered Media Processing Platform',
                'login-google': 'Login with Google',
                'login-voice': 'Voice Login',
                'voice-instruction': 'Say your name to login',
                'start-recording': 'Start Recording',
                'media-library': 'Media Library',
                'upload-media': 'Upload Media',
                'logout': 'Logout'
            },
            'hi': {
                'login-title': 'कला कनेक्ट',
                'login-subtitle': 'एआई-संचालित मीडिया प्रसंस्करण प्लेटफॉर्म',
                'login-google': 'गूगल के साथ लॉगिन करें',
                'login-voice': 'वॉइस लॉगिन',
                'voice-instruction': 'लॉगिन करने के लिए अपना नाम बोलें',
                'start-recording': 'रिकॉर्डिंग शुरू करें',
                'media-library': 'मीडिया लाइब्रेरी',
                'upload-media': 'मीडिया अपलोड करें',
                'logout': 'लॉग आउट',
                'artisan-profile': 'कारीगर प्रोफ़ाइल'
            }
        };

        const langTexts = translations[language] || translations['en'];

        // Update text content for elements with data-translate attribute
        Object.keys(langTexts).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                element.textContent = langTexts[key];
            });
        });

        // Update specific elements
        this.updateSpecificElements(language);
    }

    updateSpecificElements(language) {
        // Update login screen
        const loginTitle = document.querySelector('#login-screen h1');
        const loginSubtitle = document.querySelector('#login-screen p');
        const loginBtn = document.getElementById('login-google-btn');
        const voiceBtn = document.getElementById('login-voice-btn');
        const voiceInstruction = document.querySelector('#voice-login-container p');
        const startVoiceBtn = document.getElementById('start-voice-login-btn');

        if (loginTitle) loginTitle.textContent = this.getTranslation('login-title', language);
        if (loginSubtitle) loginSubtitle.textContent = this.getTranslation('login-subtitle', language);
        if (loginBtn) loginBtn.textContent = this.getTranslation('login-google', language);
        if (voiceBtn) voiceBtn.textContent = this.getTranslation('login-voice', language);
        if (voiceInstruction) voiceInstruction.textContent = this.getTranslation('voice-instruction', language);
        if (startVoiceBtn) startVoiceBtn.textContent = this.getTranslation('start-recording', language);

        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const screen = link.getAttribute('data-screen');
            if (screen) {
                link.textContent = this.getScreenName(screen, language);
            }
        });

        // Update buttons
        const uploadBtn = document.getElementById('upload-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (uploadBtn) uploadBtn.textContent = this.getTranslation('upload-media', language);
        if (logoutBtn) logoutBtn.textContent = this.getTranslation('logout', language);
    }

    getTranslation(key, language) {
        const translations = {
            'en': {
                'login-title': 'KalaConnect',
                'login-subtitle': 'AI-Powered Media Processing Platform',
                'login-google': 'Login with Google',
                'login-voice': 'Voice Login',
                'voice-instruction': 'Say your name to login',
                'start-recording': 'Start Recording',
                'logout': 'Logout',
                'story-weaver': 'Story Weaver',
                'digital-studio': 'Digital Studio',
                'trend-weaver': 'Trend Weaver',
                'market-navigator': 'Market Navigator'
            },
            'hi': {
                'login-title': 'कला कनेक्ट',
                'login-subtitle': 'एआई-संचालित मीडिया प्रसंस्करण प्लेटफॉर्म',
                'login-google': 'गूगल के साथ लॉगिन करें',
                'login-voice': 'वॉइस लॉगिन',
                'voice-instruction': 'लॉगिन करने के लिए अपना नाम बोलें',
                'start-recording': 'रिकॉर्डिंग शुरू करें',
                'logout': 'लॉग आउट',
                'story-weaver': 'कहानी बुनने वाला',
                'digital-studio': 'डिजिटल स्टूडियो',
                'trend-weaver': 'ट्रेंड वीवर',
                'market-navigator': 'मार्केट नेविगेटर'
            }
        };

        return translations[language]?.[key] || translations['en'][key] || key;
    }

    getScreenName(screen, language) {
        const screenNames = {
            'story-weaver': 'story-weaver',
            'digital-studio': 'digital-studio',
            'trend-weaver': 'trend-weaver',
            'market-navigator': 'market-navigator'
        };

        const key = screenNames[screen] || screen;
        return this.getTranslation(key, language);
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to translate text programmatically
    async translateText(text, targetLanguage, context = 'general') {
        try {
            // Call backend translation API
            const response = await fetch('/api/v1/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    text: text,
                    source_language: this.currentLanguage,
                    target_language: targetLanguage,
                    context: context
                })
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const result = await response.json();
            return result.translated_text || `[${targetLanguage}] ${text}`;

        } catch (error) {
            console.error('Translation error:', error);
            // Fallback to mock translation
            return `[${targetLanguage}] ${text}`;
        }
    }

    getAuthToken() {
        // Get Firebase auth token
        return localStorage.getItem('kalaConnect_auth_token') || '';
    }
}

// Initialize Translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Translator();
});
