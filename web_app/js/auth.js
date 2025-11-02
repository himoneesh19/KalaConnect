// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.voiceLoginActive = false;
        this.init();
    }

    init() {
        // Listen for authentication state changes
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                this.showStoryWeaver(); // Default to first available screen
            } else {
                this.showLogin();
            }
        });

        this.bindEvents();
    }

    bindEvents() {
        // Login buttons
        const googleBtn = document.getElementById('login-google-btn');
        const guestBtn = document.getElementById('login-guest-btn');

        if (googleBtn) googleBtn.addEventListener('click', () => this.signInWithGoogle());
        if (guestBtn) guestBtn.addEventListener('click', () => this.signInAsGuest());

        // Logout buttons
        const logoutBtns = ['logout-btn', 'logout-btn-story', 'logout-btn-studio', 'logout-btn-trend', 'logout-btn-market'];
        logoutBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => this.signOut());
        });

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                const screen = e.target.getAttribute('data-screen');
                this.navigateToScreen(screen);
            }
        });


    }

    async signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            console.log('User signed in:', result.user);
        } catch (error) {
            console.error('Sign in error:', error);
            this.showLoginStatus('Sign in failed: ' + error.message, 'error');
        }
    }

    async signInAsGuest() {
        try {
            await auth.signInAnonymously();
            console.log('Guest signed in');
        } catch (error) {
            console.error('Guest sign in error:', error);
            this.showLoginStatus('Guest sign in failed: ' + error.message, 'error');
        }
    }



    async signOut() {
        try {
            await auth.signOut();
            console.log('User signed out');
            // Hide all screens and show login
            this.hideAllScreens();
            this.showLogin();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    navigateToScreen(screenName) {
        this.hideAllScreens();

        switch (screenName) {
            case 'story-weaver':
                this.showStoryWeaver();
                break;
            case 'digital-studio':
                this.showDigitalStudio();
                break;
            case 'trend-weaver':
                this.showTrendWeaver();
                break;
            case 'market-navigator':
                this.showMarketNavigator();
                break;
            default:
                this.showStoryWeaver(); // Default to first available screen
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-screen="${screenName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    hideAllScreens() {
        const screens = [
            'login-screen',
            'story-weaver-screen',
            'digital-studio-screen',
            'trend-weaver-screen',
            'market-navigator-screen'
        ];

        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.classList.add('hidden');
        });
    }

    showLogin() {
        this.hideAllScreens();
        document.getElementById('login-screen').classList.remove('hidden');
    }



    showStoryWeaver() {
        this.hideAllScreens();
        document.getElementById('story-weaver-screen').classList.remove('hidden');
    }

    showDigitalStudio() {
        this.hideAllScreens();
        document.getElementById('digital-studio-screen').classList.remove('hidden');
    }

    showTrendWeaver() {
        this.hideAllScreens();
        document.getElementById('trend-weaver-screen').classList.remove('hidden');
    }

    showMarketNavigator() {
        this.hideAllScreens();
        document.getElementById('market-navigator-screen').classList.remove('hidden');
    }



    showLoginStatus(message, type = 'info') {
        const statusEl = document.getElementById('login-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-${type}`;
            setTimeout(() => {
                statusEl.textContent = '';
                statusEl.className = '';
            }, 5000);
        }
    }



    getCurrentUser() {
        return this.currentUser;
    }

    getIdToken() {
        return this.currentUser ? this.currentUser.getIdToken() : null;
    }
}

// Initialize auth manager
const authManager = new AuthManager();
