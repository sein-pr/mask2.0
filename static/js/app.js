// Application State
let isPaused = false;
let alarmEnabled = true;
let alarmInterval = null;
let currentlyAlarming = false;
let environmentUnsafe = false;
let speechInterval = null;
let previousUnsafeCount = 0;
let cameraHandler = null;

// DOM Elements
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

// Initialize Speech Synthesis
const synth = window.speechSynthesis;

// Flag to track if audio has been enabled
let audioEnabled = false;

// Enable audio on first user interaction (required by browsers)
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

// Play alarm sound from file
function playAlarm() {
    try {
        if (alarmSound && alarmEnabled) {
            alarmSound.currentTime = 0;
            const playPromise = alarmSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    // Autoplay was prevented - this is normal on first load
                    // Audio will work after user interacts with the page
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

// Speak text using Web Speech API
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

// Start alarm sequence for individual violations
function startAlarm() {
    if (currentlyAlarming || !alarmEnabled) return;
    
    currentlyAlarming = true;
    
    // Play alarm sound once for new violation
    playAlarm();
}

// Stop alarm sequence
function stopAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
    currentlyAlarming = false;
}

// Handle environment unsafe condition
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

// Initialize Camera
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
        showCameraError(error.message || 'Failed to access camera. Please allow camera permissions.');
        return false;
    }
}

function showCameraError(message) {
    cameraErrorText.textContent = message;
    cameraErrorOverlay.style.display = 'flex';
}

function hideCameraError() {
    cameraErrorOverlay.style.display = 'none';
}

function handleAlertData(alertData) {
    // Handle environment unsafe condition
    if (alertData.environment_unsafe !== undefined) {
        handleEnvironmentUnsafe(alertData.environment_unsafe);
    }
    
    // Handle individual violations
    if (alertData.unsafe_count !== undefined) {
        if (alertData.unsafe_count > previousUnsafeCount && !alertData.environment_unsafe) {
            playAlarm();
        }
        previousUnsafeCount = alertData.unsafe_count;
    }
}

// Toggle Detection
toggleBtn.addEventListener('click', async () => {
    // Enable audio on first user interaction
    enableAudio();
    
    isPaused = !isPaused;
    
    // Update UI
    if (isPaused) {
        toggleBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Resume Detection
        `;
        pausedOverlay.classList.add('active');
        stopAlarm();
        handleEnvironmentUnsafe(false);
        
        // Stop processing
        if (cameraHandler) {
            cameraHandler.stopProcessing();
        }
    } else {
        toggleBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Pause Detection
        `;
        pausedOverlay.classList.remove('active');
        
        // Resume processing
        if (cameraHandler) {
            cameraHandler.startProcessing((result) => {
                if (result && result.image) {
                    const img = new Image();
                    img.onload = () => {
                        const displayCanvas = document.getElementById('displayCanvas');
                        const ctx = displayCanvas.getContext('2d');
                        displayCanvas.width = img.width;
                        displayCanvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                    };
                    img.src = result.image;
                    
                    if (result.alert_data) {
                        handleAlertData(result.alert_data);
                    }
                }
            });
        }
    }
});

// Switch Camera (mobile only)
switchCameraBtn.addEventListener('click', async () => {
    if (cameraHandler) {
        try {
            const newFacingMode = await cameraHandler.switchCamera();
            console.log(`Switched to ${newFacingMode} camera`);
            
            // Resume processing if not paused
            if (!isPaused) {
                cameraHandler.startProcessing((result) => {
                    if (result && result.image) {
                        const img = new Image();
                        img.onload = () => {
                            const displayCanvas = document.getElementById('displayCanvas');
                            const ctx = displayCanvas.getContext('2d');
                            displayCanvas.width = img.width;
                            displayCanvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                        };
                        img.src = result.image;
                        
                        if (result.alert_data) {
                            handleAlertData(result.alert_data);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    }
});

// Reset Statistics
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

// Update Statistics from Server
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
        
        // Handle environment unsafe condition (> 2 people)
        if (data.environment_unsafe !== undefined) {
            handleEnvironmentUnsafe(data.environment_unsafe);
        }
        
        // Handle individual violations (play sound once when unsafe count increases)
        if (data.unsafe_count !== undefined) {
            if (data.unsafe_count > previousUnsafeCount && !data.environment_unsafe) {
                // New violation detected, play alert once
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

// Update stat value with animation
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

// Update Environment Status
function updateEnvironmentStatus(status, percentage) {
    // Update status badge
    statusBadge.className = 'status-badge ' + status;
    statusText.textContent = status === 'safe' ? 'Safe' : 'Unsafe';
    
    // Update status icon
    if (status === 'unsafe') {
        statusIconEl.className = 'status-icon unsafe';
        statusIconEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        `;
        environmentTextEl.textContent = 'Environment Unsafe!';
        environmentTextEl.style.color = 'var(--color-danger)';
    } else {
        statusIconEl.className = 'status-icon safe';
        statusIconEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        `;
        environmentTextEl.textContent = 'Environment Safe';
        environmentTextEl.style.color = 'var(--color-safe)';
    }
    
    // Update percentage
    safetyPercentageEl.textContent = `${percentage}% Compliance`;
}

// Initialize smooth stat transitions
function initializeStatTransitions() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        stat.style.transition = 'transform 0.2s ease';
    });
}

// Smooth scrolling for navigation links
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle hash links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize application
async function init() {
    console.log('MaskGuard Detection System Initialized');
    initializeStatTransitions();
    initializeNavigation();
    
    // Enable audio on any user interaction
    document.body.addEventListener('click', enableAudio, { once: true });
    document.body.addEventListener('touchstart', enableAudio, { once: true });
    
    // Also enable audio when clicking the notification
    const audioNotification = document.getElementById('audioNotification');
    if (audioNotification) {
        audioNotification.addEventListener('click', enableAudio);
    }
    
    // Initialize camera
    await initializeCamera();
    
    // Update statistics every 1 second
    setInterval(updateStatistics, 1000);
    
    // Initial statistics fetch
    updateStatistics();
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAlarm();
    handleEnvironmentUnsafe(false);
    synth.cancel();
});

