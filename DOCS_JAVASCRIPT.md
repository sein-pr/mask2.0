# 💻 JavaScript Documentation

## JavaScript Modules Overview

```
static/js/
├── navigation.js      # Mobile menu toggle
├── camera.js          # Camera handling class
├── app.js             # Live detection logic
├── upload.js          # Image upload functionality
└── pdf-export.js      # PDF report generation
```

---

## navigation.js - Mobile Menu Handler

### Purpose
Handle responsive navigation menu toggle for mobile devices

### Code Breakdown

```javascript
// Get DOM elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
```

**Elements:**
- `navToggle` - Hamburger menu button
- `navLinks` - Navigation links container

### Toggle Functionality
```javascript
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}
```

**Behavior:**
1. Click hamburger button
2. Toggle `active` class on button (animates icon)
3. Toggle `active` class on menu (shows/hides)

### Close Menu on Link Click
```javascript
const links = navLinks.querySelectorAll('.nav-link');
links.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});
```

**Purpose:** Auto-close menu after navigation

### Close Menu on Outside Click
```javascript
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});
```

**Purpose:** Close menu when clicking outside

---

## camera.js - Camera Handler Class

### Purpose
Manage camera access, frame capture, and processing

### Class Structure

```javascript
class CameraHandler {
    constructor(videoElement, canvasElement)
    async start()
    stop()
    async switchCamera()
    captureFrame()
    async sendFrameForProcessing(imageData)
    startProcessing(callback)
    stopProcessing()
}
```

### Constructor
```javascript
constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.stream = null;
    this.isProcessing = false;
    this.frameInterval = null;
    this.fps = 10; // Process 10 frames per second
}
```

**Properties:**
- `video` - HTML video element
- `canvas` - HTML canvas element
- `ctx` - Canvas 2D context
- `stream` - MediaStream object
- `isProcessing` - Processing flag
- `frameInterval` - setInterval ID
- `fps` - Frames per second to process

### start() Method
```javascript
async start() {
    try {
        // Check if camera is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera not supported in this browser');
        }

        // Check if HTTPS is required
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '[::1]';
        
        if (!isLocalhost && window.location.protocol !== 'https:') {
            throw new Error('HTTPS_REQUIRED');
        }

        // Request camera access
        const constraints = {
            video: {
                facingMode: 'user', // Front camera
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
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                console.log(`Camera started: ${this.video.videoWidth}x${this.video.videoHeight}`);
                resolve();
            };
            this.video.onerror = reject;
        });
    } catch (error) {
        // Error handling with specific messages
        if (error.name === 'NotAllowedError') {
            throw new Error('Camera permission denied...');
        } else if (error.name === 'NotFoundError') {
            throw new Error('No camera found...');
        } else if (error.name === 'NotReadableError') {
            throw new Error('Camera is already in use...');
        } else if (error.message === 'HTTPS_REQUIRED') {
            throw new Error('HTTPS_REQUIRED');
        } else {
            throw error;
        }
    }
}
```

**Process:**
1. Check browser support
2. Check HTTPS requirement
3. Define camera constraints
4. Request camera access
5. Set video source
6. Wait for metadata load
7. Start video playback
8. Set canvas dimensions
9. Handle errors with specific messages

**Error Types:**
- `NotAllowedError` - Permission denied
- `NotFoundError` - No camera found
- `NotReadableError` - Camera in use
- `HTTPS_REQUIRED` - HTTPS needed for remote access

### stop() Method
```javascript
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
```

**Purpose:** Clean up camera resources
**Steps:**
1. Stop frame processing interval
2. Stop all media tracks
3. Clear video source

### switchCamera() Method
```javascript
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
```

**Purpose:** Toggle between front and back camera (mobile)
**Returns:** New facing mode ('user' or 'environment')

### captureFrame() Method
```javascript
captureFrame() {
    if (!this.video || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
        return null;
    }

    // Draw current video frame to canvas
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    
    // Convert canvas to base64 image
    return this.canvas.toDataURL('image/jpeg', 0.8);
}
```

**Purpose:** Capture current video frame as base64 image
**Returns:** Base64 encoded JPEG string or null
**Quality:** 0.8 (80% quality for balance of size/quality)

### sendFrameForProcessing() Method
```javascript
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
```

**Purpose:** Send frame to backend for processing
**Parameters:** Base64 image data
**Returns:** Processed image and alert data
**Prevents:** Multiple simultaneous requests with `isProcessing` flag

### startProcessing() Method
```javascript
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
```

**Purpose:** Start continuous frame processing
**Parameters:** Callback function for results
**Frequency:** Based on `this.fps` (default 10 FPS)

### stopProcessing() Method
```javascript
stopProcessing() {
    if (this.frameInterval) {
        clearInterval(this.frameInterval);
        this.frameInterval = null;
    }
}
```

**Purpose:** Stop frame processing loop

### Helper Functions

#### isCameraSupported()
```javascript
function isCameraSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
```

**Purpose:** Check if browser supports camera access
**Returns:** Boolean

#### isMobile()
```javascript
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

**Purpose:** Detect mobile devices
**Returns:** Boolean
**Method:** User agent string matching

---

## app.js - Live Detection Logic

### Purpose
Main application logic for live detection page

### Global Variables

```javascript
let isPaused = false;
let alarmEnabled = true;
let alarmInterval = null;
let currentlyAlarming = false;
let environmentUnsafe = false;
let speechInterval = null;
let previousUnsafeCount = 0;
let cameraHandler = null;
```

**State Variables:**
- `isPaused` - Detection pause state
- `alarmEnabled` - Audio alerts enabled
- `alarmInterval` - Continuous alarm timer
- `currentlyAlarming` - Currently playing alarm
- `environmentUnsafe` - Environment unsafe flag
- `speechInterval` - Speech announcement timer
- `previousUnsafeCount` - Track violation changes
- `cameraHandler` - CameraHandler instance

### DOM Elements

```javascript
const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const pausedOverlay = document.getElementById('pausedOverlay');
const cameraErrorOverlay = document.getElementById('cameraError');
const cameraErrorText = document.getElementById('cameraErrorText');
const alarmSound = document.getElementById('alarmSound');

// Statistics Elements
const withMaskEl = document.getElementById('withMask');
const withoutMaskEl = document.getElementById('withoutMask');
const incorrectMaskEl = document.getElementById('incorrectMask');
const totalDetectionsEl = document.getElementById('totalDetections');
const environmentStatusEl = document.getElementById('environmentStatus');
const environmentTextEl = document.getElementById('environmentText');
const safetyPercentageEl = document.getElementById('safetyPercentage');
const statusIconEl = document.getElementById('statusIcon');
const lastViolationEl = document.getElementById('lastViolation');
```

### Audio Management

#### enableAudio()
```javascript
function enableAudio() {
    if (!audioEnabled && alarmSound) {
        alarmSound.play().then(() => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            audioEnabled = true;
            console.log('Audio enabled - alerts will now play');
            
            // Hide the notification
            const notification = document.getElementById('audioNotification');
            if (notification) {
                notification.classList.add('hidden');
            }
        }).catch(() => {
            // Still blocked, will try again on next interaction
        });
    }
}
```

**Purpose:** Enable audio after user interaction
**Why Needed:** Browser autoplay policies require user gesture

#### playAlarm()
```javascript
function playAlarm() {
    try {
        if (alarmSound && alarmEnabled) {
            alarmSound.currentTime = 0;
            const playPromise = alarmSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    if (err.name !== 'NotAllowedError') {
                        console.error('Error playing alarm:', err);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error playing alarm:', error);
    }
}
```

**Purpose:** Play alarm sound
**Error Handling:** Gracefully handle autoplay blocks

#### speak()
```javascript
function speak(text) {
    try {
        // Cancel any ongoing speech
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        synth.speak(utterance);
    } catch (error) {
        console.error('Error with speech synthesis:', error);
    }
}
```

**Purpose:** Text-to-speech announcements
**API:** Web Speech API
**Parameters:** Text to speak

### Alert Management

#### handleEnvironmentUnsafe()
```javascript
function handleEnvironmentUnsafe(isUnsafe) {
    if (isUnsafe && !environmentUnsafe) {
        // Environment just became unsafe
        environmentUnsafe = true;
        
        // Speak warning
        speak("Environment not safe");
        
        // Start continuous alarm
        if (!alarmInterval) {
            alarmInterval = setInterval(() => {
                playAlarm();
            }, 2000); // Beep every 2 seconds
        }
        
        // Repeat speech warning every 10 seconds
        if (!speechInterval) {
            speechInterval = setInterval(() => {
                speak("Environment not safe");
            }, 10000);
        }
    } else if (!isUnsafe && environmentUnsafe) {
        // Environment is now safe
        environmentUnsafe = false;
        
        // Stop continuous alarms
        if (alarmInterval) {
            clearInterval(alarmInterval);
            alarmInterval = null;
        }
        
        if (speechInterval) {
            clearInterval(speechInterval);
            speechInterval = null;
        }
        
        synth.cancel();
    }
}
```

**Purpose:** Handle environment unsafe state (>2 violations)
**Actions:**
- Play continuous alarm (every 2 seconds)
- Speak warning (every 10 seconds)
- Stop alarms when safe

### Camera Initialization

#### initializeCamera()
```javascript
async function initializeCamera() {
    if (!isCameraSupported()) {
        showCameraError('Camera not supported in this browser');
        return false;
    }

    try {
        const videoElement = document.getElementById('cameraVideo');
        const processingCanvas = document.getElementById('processingCanvas');
        const displayCanvas = document.getElementById('displayCanvas');
        
        cameraHandler = new CameraHandler(videoElement, processingCanvas);
        await cameraHandler.start();
        
        // Show switch camera button on mobile
        if (isMobile()) {
            switchCameraBtn.style.display = 'inline-flex';
        }
        
        // Start processing frames
        cameraHandler.startProcessing((result) => {
            if (result && result.image) {
                // Display the processed frame
                const img = new Image();
                img.onload = () => {
                    const ctx = displayCanvas.getContext('2d');
                    displayCanvas.width = img.width;
                    displayCanvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = result.image;
                
                // Handle alert data
                if (result.alert_data) {
                    handleAlertData(result.alert_data);
                }
            }
        });
        
        console.log('Camera initialized successfully');
        return true;
        
    } catch (error) {
        console.error('Error initializing camera:', error);
        showCameraError(error.message || 'Failed to access camera...');
        return false;
    }
}
```

**Purpose:** Initialize camera and start processing
**Steps:**
1. Check browser support
2. Get DOM elements
3. Create CameraHandler instance
4. Start camera
5. Show switch button on mobile
6. Start frame processing
7. Display processed frames
8. Handle alerts

### Button Event Handlers

#### Toggle Detection
```javascript
toggleBtn.addEventListener('click', async () => {
    enableAudio();
    
    isPaused = !isPaused;
    
    if (isPaused) {
        toggleBtn.innerHTML = `...Resume Detection`;
        pausedOverlay.classList.add('active');
        stopAlarm();
        handleEnvironmentUnsafe(false);
        
        if (cameraHandler) {
            cameraHandler.stopProcessing();
        }
    } else {
        toggleBtn.innerHTML = `...Pause Detection`;
        pausedOverlay.classList.remove('active');
        
        if (cameraHandler) {
            cameraHandler.startProcessing((result) => {
                // Process and display frames
            });
        }
    }
});
```

**Purpose:** Pause/resume detection
**Actions:**
- Toggle pause state
- Update button text/icon
- Show/hide overlay
- Stop/start processing

#### Switch Camera
```javascript
switchCameraBtn.addEventListener('click', async () => {
    if (cameraHandler) {
        try {
            const newFacingMode = await cameraHandler.switchCamera();
            console.log(`Switched to ${newFacingMode} camera`);
            
            if (!isPaused) {
                cameraHandler.startProcessing((result) => {
                    // Resume processing
                });
            }
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    }
});
```

**Purpose:** Toggle front/back camera (mobile)

#### Reset Statistics
```javascript
resetBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all statistics?')) {
        try {
            const response = await fetch('/reset_statistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Reset UI immediately
                withMaskEl.textContent = '0';
                withoutMaskEl.textContent = '0';
                incorrectMaskEl.textContent = '0';
                totalDetectionsEl.textContent = '0';
                lastViolationEl.textContent = 'No violations detected';
                updateEnvironmentStatus('safe', 100);
                stopAlarm();
                handleEnvironmentUnsafe(false);
                previousUnsafeCount = 0;
                currentlyAlarming = false;
            }
        } catch (error) {
            console.error('Error resetting statistics:', error);
        }
    }
});
```

**Purpose:** Reset all statistics
**Confirmation:** Asks user to confirm
**Actions:**
- Call backend API
- Reset UI values
- Stop alarms
- Reset state variables

### Statistics Updates

#### updateStatistics()
```javascript
async function updateStatistics() {
    if (isPaused) return;
    
    try {
        const response = await fetch('/statistics');
        const data = await response.json();
        
        // Update detection counts with animation
        updateStatValue(withMaskEl, data.with_mask);
        updateStatValue(withoutMaskEl, data.without_mask);
        updateStatValue(incorrectMaskEl, data.incorrect_mask);
        updateStatValue(totalDetectionsEl, data.total_detections);
        
        // Update environment status
        updateEnvironmentStatus(data.current_status, data.safety_percentage);
        
        // Update last violation
        if (data.last_violation) {
            lastViolationEl.textContent = `Last detected: ${data.last_violation}`;
            lastViolationEl.style.color = 'var(--color-danger)';
        } else {
            lastViolationEl.textContent = 'No violations detected';
            lastViolationEl.style.color = 'var(--color-text-secondary)';
        }
        
        // Handle environment unsafe condition
        if (data.environment_unsafe !== undefined) {
            handleEnvironmentUnsafe(data.environment_unsafe);
        }
        
        // Handle individual violations
        if (data.unsafe_count !== undefined) {
            if (data.unsafe_count > previousUnsafeCount && !data.environment_unsafe) {
                playAlarm();
            }
            previousUnsafeCount = data.unsafe_count;
        }
        
        // Reset alarm state when all clear
        if (data.current_status === 'safe' && data.unsafe_count === 0) {
            currentlyAlarming = false;
        }
        
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}
```

**Purpose:** Fetch and update statistics from backend
**Frequency:** Called every 1 second
**Updates:**
- Detection counts
- Environment status
- Last violation
- Alerts

#### updateStatValue()
```javascript
function updateStatValue(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.textContent = newValue;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}
```

**Purpose:** Update stat value with animation
**Animation:** Scale up then back to normal

#### updateEnvironmentStatus()
```javascript
function updateEnvironmentStatus(status, percentage) {
    // Update status badge
    statusBadge.className = 'status-badge ' + status;
    statusText.textContent = status === 'safe' ? 'Safe' : 'Unsafe';
    
    // Update status icon
    if (status === 'unsafe') {
        statusIconEl.className = 'status-icon unsafe';
        statusIconEl.innerHTML = `...warning icon...`;
        environmentTextEl.textContent = 'Environment Unsafe!';
        environmentTextEl.style.color = 'var(--color-danger)';
    } else {
        statusIconEl.className = 'status-icon safe';
        statusIconEl.innerHTML = `...checkmark icon...`;
        environmentTextEl.textContent = 'Environment Safe';
        environmentTextEl.style.color = 'var(--color-safe)';
    }
    
    // Update percentage
    safetyPercentageEl.textContent = `${percentage}% Compliance`;
}
```

**Purpose:** Update environment status display
**Updates:**
- Status badge color
- Status icon
- Status text
- Compliance percentage

### Initialization

#### init()
```javascript
async function init() {
    console.log('MaskGuard Detection System Initialized');
    initializeStatTransitions();
    initializeNavigation();
    
    // Enable audio on any user interaction
    document.body.addEventListener('click', enableAudio, { once: true });
    document.body.addEventListener('touchstart', enableAudio, { once: true });
    
    // Initialize camera
    await initializeCamera();
    
    // Update statistics every 1 second
    setInterval(updateStatistics, 1000);
    
    // Initial statistics fetch
    updateStatistics();
}
```

**Purpose:** Initialize application
**Steps:**
1. Initialize transitions
2. Setup navigation
3. Enable audio on interaction
4. Initialize camera
5. Start statistics polling
6. Fetch initial statistics

#### Startup
```javascript
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

**Purpose:** Start app when DOM ready

#### Cleanup
```javascript
window.addEventListener('beforeunload', () => {
    stopAlarm();
    handleEnvironmentUnsafe(false);
    synth.cancel();
});
```

**Purpose:** Clean up resources on page unload

---

