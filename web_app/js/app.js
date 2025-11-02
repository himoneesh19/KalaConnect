// Main app initialization and coordination
class App {
    constructor() {
        // API configuration - change this for production
        this.API_BASE_URL = 'https://kalaconnect-backend-88269454545.us-central1.run.app';
        this.init();
    }

    init() {
        console.log('KalaConnect Web App initialized');

        // Handle screen transitions with camera management
        this.setupScreenTransitions();
    }

    setupScreenTransitions() {
        // No camera handling needed for the 4 core features
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
