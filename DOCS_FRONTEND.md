# 🎨 Frontend Documentation

## Frontend Templates

### Template Hierarchy

```
base.html (Parent Template)
├── home.html
├── live.html
├── upload.html
└── how_it_works.html
```

---

## base.html - Master Template

### Purpose
Provides common structure for all pages:
- Navigation header
- Footer
- Meta tags
- CSS/JS includes

### Key Sections

#### 1. HTML Head
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}MaskGuard Detection System{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
```

**Components:**
- **Charset:** UTF-8 for international characters
- **Viewport:** Responsive design meta tag
- **Title Block:** Allows child templates to override
- **CSS:** Main stylesheet
- **Font:** Inter font from Google Fonts
- **Favicon:** SVG shield icon (inline data URI)

#### 2. Navigation Bar
```html
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <!-- Shield SVG icon -->
            <span class="logo-text">MaskGuard</span>
        </div>
        <button class="nav-toggle" id="navToggle">
            <!-- Hamburger menu for mobile -->
        </button>
        <div class="nav-links" id="navLinks">
            <!-- Navigation links -->
        </div>
    </div>
</nav>
```

**Features:**
- **Fixed Position:** Stays at top when scrolling
- **Responsive:** Hamburger menu on mobile
- **Active State:** Highlights current page
- **Backdrop Blur:** Glassmorphism effect

**Navigation Links:**
1. Home (`/`)
2. Live Detection (`/live`)
3. Upload Image (`/upload`)
4. How It Works (`/how-it-works`)

**Active Link Detection:**
```html
{% if request.endpoint == 'live' %}active{% endif %}
```
- Uses Flask's `request.endpoint` to determine current page
- Adds `active` class for styling

#### 3. Main Content Area
```html
<main class="main-content">
    {% block content %}{% endblock %}
</main>
```
- Content block for child templates
- Padded for fixed navbar

#### 4. Footer
```html
<footer class="footer">
    <div class="footer-content">
        <div class="footer-brand">
            <!-- Logo and name -->
        </div>
        <div class="footer-divider"></div>
        <div class="footer-info">
            <p>Developed by <strong>Aina</strong></p>
            <p>&copy; 2025 All Rights Reserved</p>
        </div>
    </div>
</footer>
```

**Components:**
- Brand logo and name
- Visual divider
- Developer credit
- Copyright notice

#### 5. JavaScript Includes
```html
<script src="{{ url_for('static', filename='js/navigation.js') }}"></script>
{% block extra_js %}{% endblock %}
```
- Navigation script (always loaded)
- Extra JS block for page-specific scripts

---

## home.html - Landing Page

### Purpose
Welcome page with feature overview and call-to-action buttons

### Structure

#### 1. Hero Section
```html
<section class="hero">
    <div class="hero-badge">
        <!-- AI-Powered Protection badge -->
    </div>
    <h1 class="hero-title">Real-Time Mask Detection System</h1>
    <p class="hero-subtitle">Advanced AI technology...</p>
    <div class="hero-actions">
        <a href="/live" class="btn btn-primary btn-large">
            Start Live Detection
        </a>
        <a href="/upload" class="btn btn-secondary btn-large">
            Upload Image
        </a>
    </div>
</section>
```

**Components:**
- **Badge:** Eye-catching feature highlight
- **Title:** Main heading with gradient effect
- **Subtitle:** Brief description
- **CTA Buttons:** Primary actions (Live/Upload)

#### 2. Features Grid
```html
<section class="features">
    <h2 class="section-title">Key Features</h2>
    <div class="features-grid">
        <!-- 4 feature cards -->
    </div>
</section>
```

**Feature Cards:**
1. Real-Time Detection
2. High Accuracy
3. Smart Alerts
4. Statistics Dashboard

**Card Structure:**
```html
<div class="feature-card">
    <div class="feature-icon">
        <!-- SVG icon -->
    </div>
    <h3>Feature Title</h3>
    <p>Feature description</p>
</div>
```

#### 3. How It Works Preview
```html
<section class="how-it-works-preview">
    <div class="detection-types">
        <!-- 3 detection type cards -->
    </div>
</section>
```

**Detection Types:**
1. Mask Worn Correctly (Green)
2. Mask Worn Incorrectly (Yellow)
3. No Mask Detected (Red)

---

## live.html - Live Detection Page

### Purpose
Real-time camera detection with statistics dashboard

### Structure

#### 1. Audio Notification Toast
```html
<div id="audioNotification" class="audio-notification">
    <!-- Speaker icon -->
    Click anywhere to enable audio alerts
</div>
```

**Purpose:** 
- Prompt user to enable audio
- Required by browser autoplay policies
- Hides after first interaction

#### 2. Page Header
```html
<header class="page-header">
    <h1 class="page-title">Live Detection Feed</h1>
    <p class="page-subtitle">Real-time mask compliance monitoring</p>
</header>
```

#### 3. Main Grid Layout
```html
<div class="main-grid">
    <div class="video-section">
        <!-- Camera feed -->
    </div>
    <div class="stats-section">
        <!-- Statistics cards -->
    </div>
</div>
```

**Layout:**
- Desktop: 2 columns (video | stats)
- Mobile: 1 column (stacked)

#### 4. Video Card
```html
<div class="card video-card">
    <div class="card-header">
        <h2>Camera Feed</h2>
        <div class="status-badge" id="statusBadge">
            <span class="status-dot"></span>
            <span id="statusText">Safe</span>
        </div>
    </div>
    <div class="video-container">
        <video id="cameraVideo" autoplay playsinline style="display: none;"></video>
        <canvas id="processingCanvas" style="display: none;"></canvas>
        <canvas id="displayCanvas"></canvas>
        <!-- Overlays for paused/error states -->
    </div>
    <div class="controls">
        <!-- Control buttons -->
    </div>
</div>
```

**Video Elements:**
- `cameraVideo` - Hidden video element for camera stream
- `processingCanvas` - Hidden canvas for frame capture
- `displayCanvas` - Visible canvas showing processed frames

**Overlays:**
1. **Paused Overlay:** Shows when detection paused
2. **Error Overlay:** Shows camera errors with helpful messages

**Control Buttons:**
1. **Pause/Resume:** Toggle detection
2. **Switch Camera:** Toggle front/back camera (mobile)
3. **Reset Stats:** Clear all statistics
4. **Export PDF:** Download statistics report

#### 5. Statistics Section

##### Environment Status Card
```html
<div class="card status-card">
    <h3 class="card-title">Environment Status</h3>
    <div class="status-indicator" id="environmentStatus">
        <div class="status-icon safe" id="statusIcon">
            <!-- Checkmark or warning icon -->
        </div>
        <h2 class="status-title" id="environmentText">Environment Safe</h2>
        <p class="status-description" id="safetyPercentage">100% Compliance</p>
    </div>
</div>
```

**Dynamic Updates:**
- Icon changes (checkmark ↔ warning)
- Color changes (green ↔ red)
- Text updates
- Shake animation when unsafe

##### Detection Statistics Card
```html
<div class="card stats-card">
    <h3 class="card-title">Detection Statistics</h3>
    <div class="stats-grid">
        <!-- 4 stat items -->
    </div>
</div>
```

**Stat Items:**
1. With Mask (Green)
2. Without Mask (Red)
3. Incorrect Mask (Orange)
4. Total Detections (Blue)

**Stat Item Structure:**
```html
<div class="stat-item stat-safe">
    <div class="stat-icon">
        <!-- SVG icon -->
    </div>
    <div class="stat-content">
        <p class="stat-label">With Mask</p>
        <p class="stat-value" id="withMask">0</p>
    </div>
</div>
```

##### Last Violation Card
```html
<div class="card violation-card">
    <h3 class="card-title">Last Violation</h3>
    <div class="violation-content">
        <p id="lastViolation" class="violation-text">
            No violations detected
        </p>
    </div>
</div>
```

#### 6. Audio Element
```html
<audio id="alarmSound" preload="auto">
    <source src="{{ url_for('static', filename='sounds/beep-warning-6387.mp3') }}" 
            type="audio/mpeg">
</audio>
```

**Purpose:** Play alert sounds for violations

#### 7. JavaScript Includes
```html
{% block extra_js %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="{{ url_for('static', filename='js/pdf-export.js') }}"></script>
<script src="{{ url_for('static', filename='js/camera.js') }}"></script>
<script src="{{ url_for('static', filename='js/app.js') }}"></script>
{% endblock %}
```

**Load Order:**
1. jsPDF library (CDN)
2. PDF export functionality
3. Camera handler
4. Main app logic

---

## upload.html - Image Upload Page

### Purpose
Upload and analyze images for mask compliance

### Structure

#### 1. Page Header
```html
<header class="page-header">
    <h1 class="page-title">Upload Image for Detection</h1>
    <p class="page-subtitle">Analyze mask compliance in your photos</p>
</header>
```

#### 2. Upload Card
```html
<div class="card upload-card">
    <div class="upload-area" id="uploadArea">
        <input type="file" id="fileInput" accept="image/*" hidden>
        <div class="upload-icon">
            <!-- Upload arrow icon -->
        </div>
        <h3>Drop your image here</h3>
        <p>or click to browse</p>
        <button class="btn btn-primary" id="browseBtn">
            Choose File
        </button>
    </div>
</div>
```

**Features:**
- Drag-and-drop support
- Click to browse
- File type validation (images only)
- Visual feedback on hover

#### 3. Results Section
```html
<div class="results-section" id="resultsSection" style="display: none;">
    <div class="results-grid">
        <!-- Original and processed images -->
    </div>
    <div class="card summary-card">
        <!-- Detection summary -->
    </div>
</div>
```

**Initially Hidden:** Shows after image upload

##### Results Grid
```html
<div class="results-grid">
    <div class="card result-card">
        <h3 class="card-title">Original Image</h3>
        <div class="image-container">
            <img id="originalImage" alt="Original">
        </div>
    </div>
    <div class="card result-card">
        <h3 class="card-title">Detection Results</h3>
        <div class="image-container">
            <img id="processedImage" alt="Processed">
            <div class="loading-overlay" id="loadingOverlay">
                <div class="spinner"></div>
                <p>Processing image...</p>
            </div>
        </div>
    </div>
</div>
```

**Layout:**
- Desktop: Side-by-side comparison
- Mobile: Stacked vertically

##### Summary Card
```html
<div class="card summary-card">
    <h3 class="card-title">Detection Summary</h3>
    <div class="summary-stats">
        <!-- 4 summary stat items -->
    </div>
    <div class="summary-actions">
        <button class="btn btn-secondary" id="uploadAnotherBtn">
            Upload Another
        </button>
    </div>
</div>
```

**Summary Stats:**
1. With Mask
2. Without Mask
3. Incorrect Mask
4. Total People

**Stat Structure:**
```html
<div class="summary-stat">
    <div class="summary-icon safe">
        <!-- Icon -->
    </div>
    <div class="summary-info">
        <p class="summary-label">With Mask</p>
        <p class="summary-value" id="summaryWithMask">0</p>
    </div>
</div>
```

#### 4. JavaScript Include
```html
{% block extra_js %}
<script src="{{ url_for('static', filename='js/upload.js') }}"></script>
{% endblock %}
```

---

## how_it_works.html - Information Page

### Purpose
Explain system functionality, usage, and FAQ

### Structure

#### 1. Technology Section
```html
<section class="info-section">
    <div class="card">
        <h2 class="section-title">Detection Technology</h2>
        <div class="info-content">
            <p class="info-text">...</p>
            <div class="tech-features">
                <!-- 3 tech feature cards -->
            </div>
        </div>
    </div>
</section>
```

**Tech Features:**
1. YOLO AI Model
2. High Performance
3. Privacy First

#### 2. Detection Categories
```html
<section class="info-section">
    <div class="card">
        <h2 class="section-title">Detection Categories</h2>
        <div class="categories-grid">
            <!-- 3 category cards -->
        </div>
    </div>
</section>
```

**Categories:**
1. Mask Worn Correctly (Green)
2. Mask Worn Incorrectly (Yellow)
3. No Mask Detected (Red)

**Category Card:**
```html
<div class="category-card safe">
    <div class="category-icon">
        <!-- Icon -->
    </div>
    <h3>Mask Worn Correctly</h3>
    <p>Face mask properly covering nose and mouth</p>
    <div class="category-indicator">
        <span class="indicator-dot safe"></span>
        <span>Green - Safe</span>
    </div>
</div>
```

#### 3. Usage Steps
```html
<section class="info-section">
    <div class="card">
        <h2 class="section-title">How to Use</h2>
        <div class="steps-container">
            <!-- 5 step items -->
        </div>
    </div>
</section>
```

**Step Structure:**
```html
<div class="step">
    <div class="step-number">1</div>
    <div class="step-content">
        <h3>Choose Detection Mode</h3>
        <p>Select between live camera detection...</p>
    </div>
</div>
```

#### 4. Alert System
```html
<section class="info-section">
    <div class="card">
        <h2 class="section-title">Alert System</h2>
        <div class="alert-info">
            <!-- 3 alert types -->
        </div>
    </div>
</section>
```

**Alert Types:**
1. Audio Alerts
2. Visual Warnings
3. Voice Announcements

#### 5. FAQ Section
```html
<section class="info-section">
    <div class="card">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list">
            <!-- FAQ items -->
        </div>
    </div>
</section>
```

**FAQ Item:**
```html
<div class="faq-item">
    <h4>Is my camera data stored or transmitted?</h4>
    <p>No. All processing happens locally...</p>
</div>
```

---

## Template Best Practices

### 1. Jinja2 Syntax
```html
<!-- Variables -->
{{ variable_name }}

<!-- Blocks -->
{% block block_name %}{% endblock %}

<!-- Conditionals -->
{% if condition %}...{% endif %}

<!-- URL Generation -->
{{ url_for('static', filename='css/style.css') }}
{{ url_for('route_name') }}
```

### 2. Static File References
```html
<!-- CSS -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">

<!-- JavaScript -->
<script src="{{ url_for('static', filename='js/app.js') }}"></script>

<!-- Images -->
<img src="{{ url_for('static', filename='images/logo.png') }}">
```

### 3. Accessibility
- Semantic HTML elements
- Alt text for images
- ARIA labels for buttons
- Keyboard navigation support
- Screen reader friendly

### 4. Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly controls
- Viewport meta tag
- Media queries in CSS

---

## Common HTML Patterns

### SVG Icons
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="..."/>
</svg>
```
- Scalable vector graphics
- Inherit color from CSS
- Lightweight and crisp

### Button Pattern
```html
<button class="btn btn-primary">
    <svg class="btn-icon">...</svg>
    Button Text
</button>
```

### Card Pattern
```html
<div class="card">
    <h3 class="card-title">Title</h3>
    <div class="card-content">
        <!-- Content -->
    </div>
</div>
```

### Grid Layout
```html
<div class="grid-container">
    <div class="grid-item">...</div>
    <div class="grid-item">...</div>
</div>
```

---
