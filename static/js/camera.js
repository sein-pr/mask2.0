// Client-side camera handler for mobile and desktop
class CameraHandler {
    constructor(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.stream = null;
        this.isProcessing = false;
        this.frameInterval = null;
        this.fps = 10; // Process 10 frames per second
    }

    async start() {
        try {
            // Check if camera is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported in this browser');
            }

            // Check if HTTPS is required (not localhost)
            const isLocalhost = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1' ||
                              window.location.hostname === '[::1]';
            
            if (!isLocalhost && window.location.protocol !== 'https:') {
                throw new Error('HTTPS_REQUIRED');
            }

            // Request camera access with mobile-friendly constraints
            const constraints = {
                video: {
                    facingMode: 'user', // Front camera by default
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            return new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    // Set canvas size to match video
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    console.log(`Camera started: ${this.video.videoWidth}x${this.video.videoHeight}`);
                    resolve();
                };
                this.video.onerror = reject;
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            
            // Provide specific error messages
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No camera found on this device.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Camera is already in use by another application.');
            } else if (error.message === 'HTTPS_REQUIRED') {
                throw new Error('HTTPS_REQUIRED');
            } else {
                throw error;
            }
        }
    }

    stop() {
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.video.srcObject = null;
    }

    async switchCamera() {
        // Get current facing mode
        const currentTrack = this.stream?.getVideoTracks()[0];
        const currentSettings = currentTrack?.getSettings();
        const currentFacingMode = currentSettings?.facingMode || 'user';
        
        // Switch to opposite camera
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Stop current stream
        this.stop();
        
        // Start with new facing mode
        const constraints = {
            video: {
                facingMode: newFacingMode,
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;
        
        return new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                resolve(newFacingMode);
            };
        });
    }

    captureFrame() {
        if (!this.video || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
            return null;
        }

        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Convert canvas to base64 image
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }

    async sendFrameForProcessing(imageData) {
        if (this.isProcessing) {
            return null;
        }

        this.isProcessing = true;

        try {
            const response = await fetch('/process_frame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imageData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.isProcessing = false;
            return data;

        } catch (error) {
            console.error('Error sending frame:', error);
            this.isProcessing = false;
            return null;
        }
    }

    startProcessing(callback) {
        // Process frames at specified FPS
        this.frameInterval = setInterval(async () => {
            const frame = this.captureFrame();
            if (frame) {
                const result = await this.sendFrameForProcessing(frame);
                if (result && callback) {
                    callback(result);
                }
            }
        }, 1000 / this.fps);
    }

    stopProcessing() {
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
    }
}

// Check if browser supports camera access
function isCameraSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Detect if running on mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

