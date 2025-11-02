// Digital Studio Module - Generative Product Photography
class DigitalStudio {
    constructor() {
        this.originalImage = null;
        this.processedImage = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const fileInput = document.getElementById('studio-file-input');
        const captureCameraBtn = document.getElementById('capture-camera-btn');
        const removeBgBtn = document.getElementById('remove-bg-btn');
        const enhanceBtn = document.getElementById('enhance-btn');
        const generateMockupBtn = document.getElementById('generate-mockup-btn');
        const loadHistoryBtn = document.getElementById('load-history-btn');

        // Camera modal controls
        const closeCameraModal = document.getElementById('close-camera-modal');
        const capturePhotoBtn = document.getElementById('capture-photo-btn');
        const retakePhotoBtn = document.getElementById('retake-photo-btn');
        const usePhotoBtn = document.getElementById('use-photo-btn');

        if (fileInput) fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        if (captureCameraBtn) captureCameraBtn.addEventListener('click', () => this.openCameraModal());
        if (closeCameraModal) closeCameraModal.addEventListener('click', () => this.closeCameraModal());
        if (capturePhotoBtn) capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        if (retakePhotoBtn) retakePhotoBtn.addEventListener('click', () => this.retakePhoto());
        if (usePhotoBtn) usePhotoBtn.addEventListener('click', () => this.useCapturedPhoto());
        if (removeBgBtn) removeBgBtn.addEventListener('click', () => this.removeBackground());
        if (enhanceBtn) enhanceBtn.addEventListener('click', () => this.enhanceImage());
        if (generateMockupBtn) generateMockupBtn.addEventListener('click', () => this.generateMockup());
        if (loadHistoryBtn) loadHistoryBtn.addEventListener('click', () => this.loadImageHistory());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showStatus('Please select a valid image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = e.target.result;
            this.displayOriginalImage(this.originalImage);
            this.showStatus('Image loaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    displayOriginalImage(imageData) {
        const originalImg = document.getElementById('original-image');
        const originalContainer = document.getElementById('original-image-container');

        if (originalImg) {
            originalImg.src = imageData;
            originalImg.classList.remove('hidden');
        }

        if (originalContainer) {
            originalContainer.classList.remove('hidden');
        }

        // Hide processed image when new image is loaded
        this.hideProcessedImage();
    }

    displayProcessedImage(imageData) {
        const processedImg = document.getElementById('processed-image');
        const processedContainer = document.getElementById('processed-image-container');

        if (processedImg) {
            processedImg.src = imageData;
            processedImg.classList.remove('hidden');
        }

        if (processedContainer) {
            processedContainer.classList.remove('hidden');
        }
    }

    hideProcessedImage() {
        const processedImg = document.getElementById('processed-image');
        const processedContainer = document.getElementById('processed-image-container');

        if (processedImg) {
            processedImg.classList.add('hidden');
        }

        if (processedContainer) {
            processedContainer.classList.add('hidden');
        }
    }

    async removeBackground() {
        if (!this.originalImage) {
            this.showStatus('Please select an image first.', 'error');
            return;
        }

        // Check if user is authenticated
        if (!authManager.getCurrentUser()) {
            this.showStatus('Please log in to use image processing features.', 'error');
            return;
        }

        try {
            this.showStatus('Removing background...', 'info');

            // Create FormData to match backend expectations
            const formData = new FormData();
            formData.append('image_url', this.originalImage);
            formData.append('operation', 'remove_bg');
            const artisanId = localStorage.getItem('kalaConnect_artisan_id');
            if (artisanId) {
                formData.append('artisan_id', artisanId);
            }

            // Call backend API for background removal
            const response = await fetch(`${app.API_BASE_URL}/api/v1/ai/process-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await authManager.getIdToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Background removal failed:', response.status, errorText);
                // Use mock background removal when API fails
                this.processedImage = this.applyMockBackgroundRemoval(this.originalImage);
                this.displayProcessedImage(this.processedImage);
                this.showStatus('Background removal simulated (AI service temporarily unavailable)', 'success');
                return;
            }

            const result = await response.json();
            this.processedImage = result.result.processed_image;
            this.displayProcessedImage(this.processedImage);

            // Check if this is a mock response
            if (result.result.note && result.result.note.includes("temporarily unavailable")) {
                this.showStatus('Background removal simulated (service temporarily unavailable)', 'success');
            } else if (result.result.note && result.result.note.includes("currently unreachable")) {
                this.showStatus('Background removal simulated (AI service unreachable)', 'warning');
            } else {
                this.showStatus('Background removed successfully!', 'success');
            }

        } catch (error) {
            console.error('Error removing background:', error);
            // Use mock background removal when there's any error
            this.processedImage = this.applyMockBackgroundRemoval(this.originalImage);
            this.displayProcessedImage(this.processedImage);
            this.showStatus('Background removal simulated (AI service temporarily unavailable)', 'success');
        }
    }

    async enhanceImage() {
        if (!this.originalImage) {
            this.showStatus('Please select an image first.', 'error');
            return;
        }

        // Check if user is authenticated
        if (!authManager.getCurrentUser()) {
            this.showStatus('Please log in to use image processing features.', 'error');
            return;
        }

        try {
            this.showStatus('Enhancing image...', 'info');

            // Create FormData to match backend expectations
            const formData = new FormData();
            formData.append('image_url', this.originalImage);
            formData.append('operation', 'enhance');
            const artisanId = localStorage.getItem('kalaConnect_artisan_id');
            if (artisanId) {
                formData.append('artisan_id', artisanId);
            }

            // Call backend API for image enhancement
            const response = await fetch(`${app.API_BASE_URL}/api/v1/ai/process-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await authManager.getIdToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Image enhancement failed:', response.status, errorText);
                // Use mock enhancement when API fails
                this.processedImage = this.applyMockEnhancement(this.originalImage);
                this.displayProcessedImage(this.processedImage);
                this.showStatus('Image enhancement simulated (AI service temporarily unavailable)', 'success');
                return;
            }

            const result = await response.json();
            this.processedImage = result.result.enhanced_image;
            this.displayProcessedImage(this.processedImage);

            // Check if this is a mock response
            if (result.result.note && result.result.note.includes("temporarily unavailable")) {
                this.showStatus('Image enhancement simulated (service temporarily unavailable)', 'success');
            } else if (result.result.note && result.result.note.includes("currently unreachable")) {
                this.showStatus('Image enhancement simulated (AI service unreachable)', 'warning');
            } else {
                this.showStatus('Image enhanced successfully!', 'success');
            }

        } catch (error) {
            console.error('Error enhancing image:', error);
            // Use mock enhancement when there's any error
            this.processedImage = this.applyMockEnhancement(this.originalImage);
            this.displayProcessedImage(this.processedImage);
            this.showStatus('Image enhancement simulated (AI service temporarily unavailable)', 'success');
        }
    }

    async generateMockup() {
        if (!this.originalImage) {
            this.showStatus('Please select an image first.', 'error');
            return;
        }

        // Check if user is authenticated
        if (!authManager.getCurrentUser()) {
            this.showStatus('Please log in to use image processing features.', 'error');
            return;
        }

        try {
            this.showStatus('Generating mockup...', 'info');

            // Create FormData to match backend expectations
            const formData = new FormData();
            formData.append('image_url', this.originalImage);
            formData.append('operation', 'generate_mockup');
            const artisanId = localStorage.getItem('kalaConnect_artisan_id');
            if (artisanId) {
                formData.append('artisan_id', artisanId);
            }

            // Call backend API for mockup generation
            const response = await fetch(`${app.API_BASE_URL}/api/v1/ai/process-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await authManager.getIdToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Mockup generation failed:', response.status, errorText);
                // Use mock mockup generation when API fails
                const mockDescription = "Professional product mockup for artisan craft. The mockup would create a studio-quality product photograph with proper lighting, background, and presentation suitable for e-commerce and marketing use.";
                this.showStatus(`Mockup generation simulated: ${mockDescription}`, 'success');
                return;
            }

            const result = await response.json();
            // For mockup generation, display the description instead of an image
            if (result.result.note && result.result.note.includes("temporarily unavailable")) {
                this.showStatus(`Mockup generation simulated: ${result.result.mockup_description}`, 'success');
            } else if (result.note && result.note.includes("currently unreachable")) {
                this.showStatus(`Mockup generation simulated (AI service unreachable): ${result.result.mockup_description}`, 'warning');
            } else {
                this.showStatus(`Mockup generated: ${result.result.mockup_description}`, 'success');
            }

        } catch (error) {
            console.error('Error generating mockup:', error);
            // Use mock mockup generation when there's any error
            const mockDescription = "Professional product mockup for artisan craft. The mockup would create a studio-quality product photograph with proper lighting, background, and presentation suitable for e-commerce and marketing use.";
            this.showStatus(`Mockup generation simulated: ${mockDescription}`, 'success');
        }
    }

    applyMockBackgroundRemoval(imageData) {
        // This is a mock function - in production, you'd use a real background removal service
        // For demo, we'll just return the original image with a note
        return imageData; // Placeholder - would be processed image
    }

    applyMockEnhancement(imageData) {
        // This is a mock function - in production, you'd use a real image enhancement API
        return imageData; // Placeholder - would be enhanced image
    }

    applyMockMockup(imageData) {
        // This is a mock function - in production, you'd use a real mockup generation service
        return imageData; // Placeholder - would be mockup image
    }

    // Camera functionality
    async openCameraModal() {
        const modal = document.getElementById('camera-modal');
        const video = document.getElementById('camera-stream');

        if (modal && video) {
            modal.classList.remove('hidden');

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Use back camera on mobile
                });
                video.srcObject = stream;
                this.showStatus('Camera opened successfully!', 'success');
            } catch (error) {
                console.error('Error accessing camera:', error);
                this.showStatus('Error accessing camera. Please check permissions.', 'error');
                this.closeCameraModal();
            }
        }
    }

    closeCameraModal() {
        const modal = document.getElementById('camera-modal');
        const video = document.getElementById('camera-stream');

        if (modal) {
            modal.classList.add('hidden');
        }

        if (video && video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }

        // Reset camera controls
        this.resetCameraControls();
    }

    resetCameraControls() {
        const captureBtn = document.getElementById('capture-photo-btn');
        const retakeBtn = document.getElementById('retake-photo-btn');
        const useBtn = document.getElementById('use-photo-btn');
        const canvas = document.getElementById('camera-canvas');

        if (captureBtn) captureBtn.classList.remove('hidden');
        if (retakeBtn) retakeBtn.classList.add('hidden');
        if (useBtn) useBtn.classList.add('hidden');
        if (canvas) canvas.classList.add('hidden');
    }

    capturePhoto() {
        const video = document.getElementById('camera-stream');
        const canvas = document.getElementById('camera-canvas');
        const captureBtn = document.getElementById('capture-photo-btn');
        const retakeBtn = document.getElementById('retake-photo-btn');
        const useBtn = document.getElementById('use-photo-btn');

        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Show canvas and hide video
            canvas.classList.remove('hidden');
            video.classList.add('hidden');

            // Update controls
            if (captureBtn) captureBtn.classList.add('hidden');
            if (retakeBtn) retakeBtn.classList.remove('hidden');
            if (useBtn) useBtn.classList.remove('hidden');

            this.showStatus('Photo captured! Click "Use Photo" to proceed.', 'success');
        }
    }

    retakePhoto() {
        const video = document.getElementById('camera-stream');
        const canvas = document.getElementById('camera-canvas');

        if (video && canvas) {
            // Show video and hide canvas
            video.classList.remove('hidden');
            canvas.classList.add('hidden');

            this.resetCameraControls();
            this.showStatus('Ready to capture photo.', 'info');
        }
    }

    useCapturedPhoto() {
        const canvas = document.getElementById('camera-canvas');

        if (canvas) {
            // Convert canvas to data URL
            this.originalImage = canvas.toDataURL('image/jpeg', 0.8);
            this.displayOriginalImage(this.originalImage);

            // Save to Firebase Storage and Firestore
            this.saveCapturedImageToFirebase(this.originalImage);

            this.closeCameraModal();
            this.showStatus('Photo loaded successfully!', 'success');
        }
    }

    async saveCapturedImageToFirebase(imageData) {
        try {
            const user = authManager.getCurrentUser();
            if (!user) {
                console.warn('User not authenticated, skipping Firebase save');
                return;
            }

            // Upload to Firebase Storage
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`digital-studio/${user.uid}/${Date.now()}_captured.jpg`);

            // Convert data URL to blob
            const response = await fetch(imageData);
            const blob = await response.blob();

            const snapshot = await imageRef.put(blob);
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Save metadata to Firestore
            await firebase.firestore().collection('digitalStudioImages').add({
                userId: user.uid,
                imageUrl: downloadURL,
                type: 'captured',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                operations: []
            });

            console.log('Image saved to Firebase successfully');
        } catch (error) {
            console.error('Error saving image to Firebase:', error);
            this.showStatus('Image captured but failed to save to cloud.', 'warning');
        }
    }

    async loadImageHistory() {
        try {
            const user = authManager.getCurrentUser();
            if (!user) {
                this.showStatus('Please log in to view your image history.', 'error');
                return;
            }

            this.showStatus('Loading image history...', 'info');

            // Fetch user's images from Firestore
            const querySnapshot = await firebase.firestore()
                .collection('digitalStudioImages')
                .where('userId', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .limit(20)
                .get();

            const images = [];
            querySnapshot.forEach((doc) => {
                images.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.displayImageHistory(images);
            this.showStatus(`Loaded ${images.length} images from history.`, 'success');

        } catch (error) {
            console.error('Error loading image history:', error);
            this.showStatus('Error loading image history. Please try again.', 'error');
        }
    }

    displayImageHistory(images) {
        const historyContainer = document.getElementById('image-history');
        const gallery = document.getElementById('history-gallery');

        if (!historyContainer || !gallery) return;

        // Clear existing content
        gallery.innerHTML = '';

        if (images.length === 0) {
            gallery.innerHTML = '<p class="no-history">No images found in your history.</p>';
            historyContainer.classList.remove('hidden');
            return;
        }

        // Create history items
        images.forEach(image => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.onclick = () => this.loadImageFromHistory(image);

            const date = image.timestamp ? new Date(image.timestamp.toDate()).toLocaleDateString() : 'Unknown date';

            item.innerHTML = `
                <img src="${image.imageUrl}" alt="Captured image" class="history-thumbnail" loading="lazy">
                <div class="history-info">
                    <div class="date">${date}</div>
                    <div class="type">${image.type || 'Captured'}</div>
                </div>
            `;

            gallery.appendChild(item);
        });

        // Show the history container
        historyContainer.classList.remove('hidden');
    }

    loadImageFromHistory(image) {
        this.originalImage = image.imageUrl;
        this.displayOriginalImage(this.originalImage);
        this.showStatus('Image loaded from history!', 'success');

        // Scroll to the top of the studio canvas
        const canvas = document.getElementById('studio-canvas');
        if (canvas) {
            canvas.scrollIntoView({ behavior: 'smooth' });
        }
    }

    applyMockBackgroundRemoval(imageData) {
        // Simulate background removal by returning the original image with a note
        // In a real implementation, this would process the image data
        return imageData;
    }

    applyMockEnhancement(imageData) {
        // Simulate image enhancement by returning the original image
        // In a real implementation, this would apply brightness, contrast, etc.
        return imageData;
    }

    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('studio-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status-${type}`;
        }
    }
}

// Initialize Digital Studio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('digital-studio-screen')) {
        new DigitalStudio();
    }
});
