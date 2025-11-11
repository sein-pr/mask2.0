# 🎨 CSS Documentation

## CSS Architecture

### File Structure
```
static/css/
└── style.css (Single comprehensive stylesheet)
```

### Organization
1. Global Styles & Reset
2. CSS Variables (Design Tokens)
3. Layout Components
4. Navigation
5. Cards & Containers
6. Buttons & Controls
7. Statistics & Status
8. Forms & Inputs
9. Animations
10. Responsive Design

---

## CSS Variables (Design Tokens)

### Purpose
Centralized design system for consistent styling

### Color Scheme - Faint Blue & Black Theme

```css
:root {
    /* Background Colors */
    --color-bg: #0a0e1a;              /* Main background - very dark blue */
    --color-bg-secondary: #111827;     /* Secondary background */
    --color-surface: #1a1f35;          /* Card/surface color */
    --color-surface-hover: #242b45;    /* Hover state */
    --color-border: #2d3548;           /* Border color */
    
    /* Text Colors */
    --color-text-primary: #e8edf5;     /* Main text - light */
    --color-text-secondary: #9ca3af;   /* Secondary text - gray */
    --color-text-tertiary: #6b7280;    /* Tertiary text - darker gray */
    
    /* Primary Color (Blue) */
    --color-primary: #3b82f6;          /* Bright blue */
    --color-primary-hover: #2563eb;    /* Darker blue on hover */
    --color-primary-light: #1e3a8a;    /* Light blue variant */
    --color-primary-glow: rgba(59, 130, 246, 0.15);  /* Glow effect */
    
    /* Status Colors */
    --color-safe: #10b981;             /* Green - safe */
    --color-safe-light: #065f46;       /* Dark green */
    --color-safe-bg: rgba(16, 185, 129, 0.1);  /* Green background */
    
    --color-danger: #ef4444;           /* Red - danger */
    --color-danger-light: #991b1b;     /* Dark red */
    --color-danger-bg: rgba(239, 68, 68, 0.1);  /* Red background */
    
    --color-warning: #f59e0b;          /* Orange - warning */
    --color-warning-light: #92400e;    /* Dark orange */
    --color-warning-bg: rgba(245, 158, 11, 0.1);  /* Orange background */
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
    
    /* Border Radius */
    --radius-sm: 0.375rem;   /* 6px */
    --radius-md: 0.5rem;     /* 8px */
    --radius-lg: 0.75rem;    /* 12px */
    --radius-xl: 1rem;       /* 16px */
}
```

### Usage Example
```css
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
}
```

**Benefits:**
- Easy theme changes
- Consistent colors
- Maintainable code
- Dark mode ready

---

## Global Styles

### Reset & Base
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0a0e1a 0%, #111827 100%);
    color: var(--color-text-primary);
    line-height: 1.6;
    min-height: 100vh;
}
```

**Key Features:**
- Box-sizing for predictable layouts
- Smooth scrolling
- System font stack with fallbacks
- Gradient background
- Minimum viewport height

---

## Layout Components

### Container
```css
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}
```

**Purpose:** Center content with max width
**Responsive:** Padding adjusts on mobile

### Main Content
```css
.main-content {
    padding-top: 80px;
    min-height: calc(100vh - 200px);
}
```

**Purpose:** Account for fixed navbar
**Height:** Minimum height minus footer

### Grid Layouts
```css
.main-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    margin-bottom: 2rem;
}

@media (max-width: 1024px) {
    .main-grid {
        grid-template-columns: 1fr;
    }
}
```

**Desktop:** 2 columns (main content | sidebar)
**Mobile:** 1 column (stacked)

---

## Navigation

### Navbar
```css
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(26, 31, 53, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    border-bottom: 1px solid var(--color-border);
}
```

**Features:**
- Fixed position (stays on top)
- Semi-transparent background
- Backdrop blur (glassmorphism)
- High z-index (above content)

### Nav Container
```css
.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
}
```

**Layout:** Flexbox with space-between
**Height:** Fixed 80px

### Nav Logo
```css
.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    z-index: 1001;
}

.logo-text {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

**Features:**
- Gradient text effect
- Icon + text layout
- High z-index for mobile menu

### Nav Links
```css
.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 80%;
    height: 2px;
    background: var(--color-primary);
    transition: transform 0.3s ease;
}

.nav-link:hover::before {
    transform: translateX(-50%) scaleX(1);
}

.nav-link.active {
    background: var(--color-primary-glow);
    color: var(--color-primary);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
}
```

**Features:**
- Underline animation on hover
- Active state with glow
- Smooth transitions

### Mobile Menu Toggle
```css
.nav-toggle {
    display: none;
    flex-direction: column;
    gap: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
}

.nav-toggle span {
    width: 1.5rem;
    height: 2px;
    background: var(--color-text-primary);
    transition: all 0.3s ease;
    border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(0.5rem, 0.5rem);
}

.nav-toggle.active span:nth-child(2) {
    opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(0.5rem, -0.5rem);
}
```

**Animation:** Hamburger → X transformation

---

## Cards & Containers

### Card Base
```css
.card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    overflow: hidden;
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: var(--shadow-lg);
    border-color: rgba(59, 130, 246, 0.3);
}
```

**Features:**
- Elevated appearance
- Hover effect
- Smooth transitions

### Card Header
```css
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: rgba(59, 130, 246, 0.05);
}
```

**Layout:** Flexbox with space-between
**Background:** Subtle blue tint

### Card Title
```css
.card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}
```

---

## Buttons & Controls

### Button Base
```css
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    font-family: inherit;
    text-decoration: none;
}
```

**Features:**
- Flexbox for icon + text
- Smooth transitions
- Consistent spacing

### Button Variants

#### Primary Button
```css
.btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
```

**Features:**
- Gradient background
- Glow shadow
- Lift on hover

#### Secondary Button
```css
.btn-secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    transform: translateY(-2px);
}
```

**Features:**
- Outlined style
- Subtle hover effect

#### Large Button
```css
.btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}
```

---

## Statistics & Status

### Status Badge
```css
.status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    background: var(--color-safe-bg);
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--color-safe);
}

.status-badge.unsafe {
    background: var(--color-danger-bg);
    color: var(--color-danger);
}

.status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--color-safe);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

**Features:**
- Pulsing dot animation
- Color-coded states
- Compact design

### Status Icon
```css
.status-icon {
    width: 5rem;
    height: 5rem;
    margin: 0 auto 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.status-icon.safe {
    background: var(--color-safe-bg);
    color: var(--color-safe);
}

.status-icon.unsafe {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    animation: shake 0.5s infinite;
}

@keyframes shake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
}
```

**Features:**
- Large circular icon
- Shake animation when unsafe
- Color-coded backgrounds

### Stat Items
```css
.stat-item {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s ease;
}

.stat-item:hover {
    transform: translateY(-2px);
}

.stat-safe { background: var(--color-safe-bg); }
.stat-danger { background: var(--color-danger-bg); }
.stat-warning { background: var(--color-warning-bg); }
.stat-info { background: var(--color-primary-glow); }
```

**Features:**
- Color-coded backgrounds
- Hover lift effect
- Icon + content layout

### Stat Value
```css
.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
    transition: transform 0.2s ease;
}
```

**Animation:** Scale effect on update (via JavaScript)

---

## Forms & Inputs

### Upload Area
```css
.upload-area {
    padding: 4rem 2rem;
    text-align: center;
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    margin: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-area:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-glow);
}
```

**Features:**
- Dashed border
- Hover effect
- Large click target

---

## Animations

### Fade In
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    animation: fadeIn 0.5s ease;
}
```

### Slide Up
```css
@keyframes slideUp {
    from {
        bottom: -100px;
        opacity: 0;
    }
    to {
        bottom: 2rem;
        opacity: 1;
    }
}
```

### Spin (Loading)
```css
@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
```

---

## Responsive Design

### Breakpoints
- **Desktop:** > 1024px
- **Tablet:** 481px - 1024px
- **Mobile:** ≤ 480px

### Mobile Styles (≤ 768px)
```css
@media (max-width: 768px) {
    .nav-container {
        padding: 0 1rem;
    }
    
    .nav-toggle {
        display: flex;
    }
    
    .nav-links {
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: rgba(26, 31, 53, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem;
        gap: 0.5rem;
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .nav-links.active {
        transform: translateY(0);
        opacity: 1;
    }
    
    .main-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .controls {
        flex-direction: column;
    }
}
```

**Changes:**
- Show hamburger menu
- Stack navigation vertically
- Single column layouts
- Full-width buttons

---

## Best Practices

### 1. CSS Variables
```css
/* Good */
color: var(--color-primary);

/* Avoid */
color: #3b82f6;
```

### 2. Transitions
```css
/* Smooth transitions */
transition: all 0.3s ease;

/* Specific properties (better performance) */
transition: transform 0.3s ease, opacity 0.3s ease;
```

### 3. Flexbox vs Grid
```css
/* Flexbox for 1D layouts */
.nav-links {
    display: flex;
    gap: 1rem;
}

/* Grid for 2D layouts */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}
```

### 4. Mobile-First
```css
/* Base styles (mobile) */
.element {
    font-size: 1rem;
}

/* Desktop enhancement */
@media (min-width: 768px) {
    .element {
        font-size: 1.25rem;
    }
}
```

### 5. Accessibility
```css
/* Focus states */
button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* High contrast */
@media (prefers-contrast: high) {
    .card {
        border-width: 2px;
    }
}
```

---

## Performance Tips

### 1. Use Transform for Animations
```css
/* Good (GPU accelerated) */
transform: translateY(-2px);

/* Avoid (causes reflow) */
top: -2px;
```

### 2. Will-Change
```css
.animated-element {
    will-change: transform;
}
```

**Use sparingly:** Only for elements that will animate

### 3. Contain
```css
.card {
    contain: layout style paint;
}
```

**Purpose:** Limit browser recalculations

---
