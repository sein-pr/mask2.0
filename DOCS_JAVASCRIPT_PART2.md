# 💻 JavaScript Documentation (Part 2)

## upload.js - Image Upload Handler

### Purpose
Handle image upload, drag-and-drop, and display results

### DOM Elements

```javascript
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const resultsSection = document.getElementById('resultsSection');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const loadingOverlay = document.getElementById('loadingOverlay');
const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');

// Summary elements
const summaryWithMask = document.getElementById('summaryWithMask');
const summaryWithoutMask = document.getElementById('summaryWithoutMask');
const summaryIncorrectMask = document.getElementById('summaryIncorrectMask');
const summaryTotal = document.getElementById('summaryTotal');
```

### Event Handlers

#### Browse Button Click
```javascript
browseBtn.addEventListener('click', () => {
    fileInput.click();
});
```

**Purpose:** Trigger file input when button clicked

#### Upload Area Click
```javascript
uploadArea.addEventListener('click', (e) => {
    if (e.target !== browseBtn) {
        fileInput.click();
    }
});
```

**Purpose:** Click anywhere in upload area to browse
**Exception:** Don't trigger if clicking the button itself

#### Drag and Drop

##### Drag Over
```javascript
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--color-primary)';
    uploadArea.style.background = 'var(--color-primary-glow)';
});
```

**Purpose:** Visual feedback when dragging over
**Styling:** Blue border and glow effect

##### Drag Leave
```javascript
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
});
```

**Purpose:** Reset styling when drag leaves

##### Drop
```javascript
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});
```

**Purpose:** Handle dropped files
**Process:**
1. Prevent default behavior
2. Reset styling
3. Get dropped files
4. Process first file

#### File Input Change
```javascript
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});
```

**Purpose:** Handle file selection from browse dialog

### File Processing

#### handleFile()
```javascript
async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    // Show results section
    resultsSection.style.display = 'block';
    loadingOverlay.style.display = 'flex';

    // Display original image
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        processImage(e.target.result);
    };
    reader.readAsDataURL(file);
}
```

**Purpose:** Validate and process uploaded file
**Steps:**
1. Validate file type (must be image)
2. Show results section
3. Show loading overlay
4. Read file as Data URL
5. Display original image
6. Process image

#### processImage()
```javascript
async function processImage(imageData) {
    try {
        const response = await fetch('/process_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        if (!response.ok) {
            throw new Error('Processing failed');
        }

        const data = await response.json();
        
        // Display processed image
        processedImage.src = data.image;
        loadingOverlay.style.display = 'none';

        // Update summary with actual detection counts
        updateSummary(data.detections);

    } catch (error) {
        console.error('Error processing image:', error);
        loadingOverlay.style.display = 'none';
        alert('Failed to process image. Please try again.');
    }
}
```

**Purpose:** Send image to backend for processing
**API Endpoint:** `/process_image`
**Request:** JSON with base64 image
**Response:** Processed image and detection counts
**Error Handling:** Show alert on failure

#### updateSummary()
```javascript
function updateSummary(detections) {
    summaryWithMask.textContent = detections.with_mask || 0;
    summaryWithoutMask.textContent = detections.without_mask || 0;
    summaryIncorrectMask.textContent = detections.incorrect_mask || 0;
    summaryTotal.textContent = detections.total || 0;
    
    // Add animation to values
    [summaryWithMask, summaryWithoutMask, summaryIncorrectMask, summaryTotal].forEach(el => {
        el.style.transform = 'scale(1.2)';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
        }, 200);
    });
}
```

**Purpose:** Update summary statistics with animation
**Animation:** Scale up then back to normal (200ms)

#### Upload Another Button
```javascript
uploadAnotherBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    fileInput.value = '';
    originalImage.src = '';
    processedImage.src = '';
});
```

**Purpose:** Reset upload interface
**Actions:**
- Hide results section
- Clear file input
- Clear image sources

---

## pdf-export.js - PDF Report Generation

### Purpose
Generate and download PDF reports of detection statistics

### Main Function

```javascript
function exportStatisticsToPDF() {
    // Check if jsPDF is available
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    // Get current statistics
    const withMask = document.getElementById('withMask')?.textContent || '0';
    const withoutMask = document.getElementById('withoutMask')?.textContent || '0';
    const incorrectMask = document.getElementById('incorrectMask')?.textContent || '0';
    const totalDetections = document.getElementById('totalDetections')?.textContent || '0';
    const safetyPercentage = document.getElementById('safetyPercentage')?.textContent || '100% Compliance';
    const environmentText = document.getElementById('environmentText')?.textContent || 'Environment Safe';
    const lastViolation = document.getElementById('lastViolation')?.textContent || 'No violations detected';
    
    // Calculate compliance
    const total = parseInt(withMask) + parseInt(withoutMask) + parseInt(incorrectMask);
    const compliant = parseInt(withMask);
    const compliance = total > 0 ? Math.round((compliant / total) * 100) : 100;
    
    // ... PDF generation code ...
    
    // Save the PDF
    const filename = `MaskGuard_Report_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}.pdf`;
    doc.save(filename);
}
```

### PDF Structure

#### 1. Header
```javascript
// Header
doc.setFontSize(20);
doc.setTextColor(59, 130, 246); // Blue color
doc.text('MaskGuard Detection Report', 105, 20, { align: 'center' });

// Date and time
doc.setFontSize(10);
doc.setTextColor(100);
const now = new Date();
doc.text(`Generated: ${now.toLocaleString()}`, 105, 28, { align: 'center' });

// Line separator
doc.setDrawColor(200);
doc.line(20, 32, 190, 32);
```

**Components:**
- Title (centered, blue, 20pt)
- Generation timestamp (centered, gray, 10pt)
- Horizontal line separator

#### 2. Environment Status
```javascript
doc.setFontSize(14);
doc.setTextColor(0);
doc.text('Environment Status', 20, 42);

doc.setFontSize(11);
doc.setTextColor(60);
doc.text(`Status: ${environmentText}`, 30, 50);
doc.text(`Compliance: ${safetyPercentage}`, 30, 57);
```

**Content:**
- Section title
- Current status
- Compliance percentage

#### 3. Detection Statistics
```javascript
doc.setFontSize(14);
doc.setTextColor(0);
doc.text('Detection Statistics', 20, 72);

doc.setFontSize(11);
doc.setTextColor(60);

// With Mask (Green)
doc.setTextColor(16, 185, 129);
doc.text(`✓ With Mask:`, 30, 82);
doc.setTextColor(0);
doc.text(withMask, 80, 82);

// Without Mask (Red)
doc.setTextColor(239, 68, 68);
doc.text(`✗ Without Mask:`, 30, 90);
doc.setTextColor(0);
doc.text(withoutMask, 80, 90);

// Incorrect Mask (Orange)
doc.setTextColor(245, 158, 11);
doc.text(`⚠ Incorrect Mask:`, 30, 98);
doc.setTextColor(0);
doc.text(incorrectMask, 80, 98);

// Total
doc.setTextColor(60);
doc.text(`Total Detections:`, 30, 106);
doc.setTextColor(0);
doc.text(totalDetections, 80, 106);
```

**Features:**
- Color-coded labels
- Aligned values
- Icons for visual clarity

#### 4. Last Violation
```javascript
doc.setFontSize(14);
doc.setTextColor(0);
doc.text('Last Violation', 20, 121);

doc.setFontSize(11);
doc.setTextColor(60);
const violationLines = doc.splitTextToSize(lastViolation, 160);
doc.text(violationLines, 30, 129);
```

**Features:**
- Text wrapping for long violations
- Indented content

#### 5. Summary Box
```javascript
const boxY = 145;
doc.setFillColor(59, 130, 246);
doc.roundedRect(20, boxY, 170, 30, 3, 3, 'F');

doc.setFontSize(12);
doc.setTextColor(255);
doc.text('Summary', 105, boxY + 10, { align: 'center' });

doc.setFontSize(10);
const summaryText = `${compliant} out of ${total} people (${compliance}%) wearing masks correctly`;
doc.text(summaryText, 105, boxY + 20, { align: 'center' });
```

**Features:**
- Blue rounded rectangle background
- White text
- Centered content
- Compliance calculation

#### 6. Footer
```javascript
doc.setFontSize(8);
doc.setTextColor(150);
doc.text('MaskGuard Detection System - Developed by Aina', 105, 280, { align: 'center' });
doc.text('© 2025 All Rights Reserved', 105, 285, { align: 'center' });
```

**Content:**
- System name and developer
- Copyright notice

### Filename Generation

```javascript
const filename = `MaskGuard_Report_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}.pdf`;
```

**Format:** `MaskGuard_Report_YYYY-MM-DD_HH-MM.pdf`
**Example:** `MaskGuard_Report_2025-11-08_15-30.pdf`

### jsPDF Methods Used

- `setFontSize(size)` - Set font size
- `setTextColor(r, g, b)` - Set text color (RGB)
- `setDrawColor(gray)` - Set line color
- `setFillColor(r, g, b)` - Set fill color
- `text(text, x, y, options)` - Add text
- `line(x1, y1, x2, y2)` - Draw line
- `roundedRect(x, y, w, h, rx, ry, style)` - Draw rounded rectangle
- `splitTextToSize(text, maxWidth)` - Wrap text
- `save(filename)` - Download PDF

---

## Common JavaScript Patterns

### 1. Async/Await Pattern
```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/endpoint');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

**Benefits:**
- Cleaner than callbacks
- Better error handling
- Easier to read

### 2. Event Listener Pattern
```javascript
element.addEventListener('event', (e) => {
    // Handle event
});
```

**Best Practices:**
- Use arrow functions for `this` binding
- Prevent default when needed
- Remove listeners when done

### 3. DOM Manipulation Pattern
```javascript
// Get element
const element = document.getElementById('id');

// Update content
element.textContent = 'New text';

// Update style
element.style.property = 'value';

// Add/remove class
element.classList.add('class');
element.classList.remove('class');
element.classList.toggle('class');
```

### 4. Animation Pattern
```javascript
element.style.transform = 'scale(1.2)';
setTimeout(() => {
    element.style.transform = 'scale(1)';
}, 200);
```

**Alternative:** CSS transitions
```css
.element {
    transition: transform 0.2s ease;
}
```

### 5. Error Handling Pattern
```javascript
try {
    // Risky operation
    const result = await riskyFunction();
} catch (error) {
    console.error('Error:', error);
    // Show user-friendly message
    alert('Something went wrong. Please try again.');
} finally {
    // Cleanup
    cleanup();
}
```

### 6. Debounce Pattern
```javascript
let timeout;
function debounce(func, delay) {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
}

// Usage
input.addEventListener('input', () => {
    debounce(() => {
        // Handle input
    }, 300);
});
```

**Purpose:** Limit function calls during rapid events

### 7. Promise Pattern
```javascript
function asyncOperation() {
    return new Promise((resolve, reject) => {
        // Async work
        if (success) {
            resolve(result);
        } else {
            reject(error);
        }
    });
}

// Usage
asyncOperation()
    .then(result => {
        // Handle success
    })
    .catch(error => {
        // Handle error
    });
```

### 8. Module Pattern
```javascript
const MyModule = (function() {
    // Private variables
    let privateVar = 'private';
    
    // Private functions
    function privateFunction() {
        // ...
    }
    
    // Public API
    return {
        publicMethod: function() {
            // Can access private members
        }
    };
})();
```

**Benefits:**
- Encapsulation
- Namespace management
- Private members

---

## Browser APIs Used

### 1. MediaDevices API
```javascript
navigator.mediaDevices.getUserMedia(constraints)
```

**Purpose:** Access camera/microphone
**Returns:** Promise<MediaStream>

### 2. Canvas API
```javascript
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0, width, height);
const dataURL = canvas.toDataURL('image/jpeg', quality);
```

**Purpose:** Image manipulation and capture

### 3. Fetch API
```javascript
fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
```

**Purpose:** HTTP requests

### 4. FileReader API
```javascript
const reader = new FileReader();
reader.onload = (e) => {
    const dataURL = e.target.result;
};
reader.readAsDataURL(file);
```

**Purpose:** Read file contents

### 5. Web Speech API
```javascript
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(text);
synth.speak(utterance);
```

**Purpose:** Text-to-speech

### 6. Audio API
```javascript
const audio = new Audio('sound.mp3');
audio.play();
```

**Purpose:** Play sounds

### 7. LocalStorage API
```javascript
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');
```

**Purpose:** Persistent storage (not used in current app)

---

## Performance Considerations

### 1. Frame Rate Limiting
```javascript
this.fps = 10; // Process 10 frames per second
```

**Why:** Balance between responsiveness and CPU usage

### 2. Processing Flag
```javascript
if (this.isProcessing) {
    return null;
}
this.isProcessing = true;
```

**Why:** Prevent multiple simultaneous requests

### 3. Image Quality
```javascript
canvas.toDataURL('image/jpeg', 0.8);
```

**Why:** 80% quality balances size and quality

### 4. Debouncing
```javascript
setInterval(updateStatistics, 1000);
```

**Why:** Update every second, not on every frame

### 5. Cleanup
```javascript
window.addEventListener('beforeunload', () => {
    // Stop intervals
    // Release resources
});
```

**Why:** Prevent memory leaks

---

## Security Considerations

### 1. Input Validation
```javascript
if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
}
```

**Why:** Prevent non-image files

### 2. Error Handling
```javascript
try {
    // Risky operation
} catch (error) {
    console.error('Error:', error);
    // Don't expose internal errors to user
    alert('Something went wrong');
}
```

**Why:** Don't leak sensitive information

### 3. HTTPS Check
```javascript
if (!isLocalhost && window.location.protocol !== 'https:') {
    throw new Error('HTTPS_REQUIRED');
}
```

**Why:** Camera requires HTTPS on remote connections

### 4. Content Security
```javascript
// Use textContent instead of innerHTML
element.textContent = userInput;
```

**Why:** Prevent XSS attacks

---
