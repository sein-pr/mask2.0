# 🚀 MaskGuard Quick Reference Card

## 📚 Documentation Files

| File | Purpose | Start Here For |
|------|---------|----------------|
| **DOCUMENTATION_INDEX.md** | Navigation hub | Finding anything |
| **CODE_DOCUMENTATION.md** | Backend code | Python/Flask/API |
| **DOCS_FRONTEND.md** | HTML templates | Page structure |
| **DOCS_JAVASCRIPT.md** | Core JS | Camera/Detection |
| **DOCS_JAVASCRIPT_PART2.md** | Additional JS | Upload/PDF |
| **DOCS_CSS.md** | Styling | Design/Layout |

## 🔗 Quick Links

### Common Tasks
- **Add new page** → DOCUMENTATION_INDEX.md → "Adding a New Page"
- **Add API endpoint** → CODE_DOCUMENTATION.md → Route Handlers
- **Modify styling** → DOCS_CSS.md → Components
- **Fix camera** → CAMERA_FIX.md
- **Setup HTTPS** → HTTPS_SETUP.md

### By Technology
- **Python** → CODE_DOCUMENTATION.md
- **HTML** → DOCS_FRONTEND.md
- **JavaScript** → DOCS_JAVASCRIPT.md + Part 2
- **CSS** → DOCS_CSS.md

### By Feature
- **Live Detection** → All docs (search "live")
- **Image Upload** → All docs (search "upload")
- **Statistics** → All docs (search "statistics")
- **PDF Export** → DOCS_JAVASCRIPT_PART2.md

## 📂 File Structure

```
maskguard/
├── app.py                    # Main backend
├── requirements.txt          # Dependencies
├── templates/               # HTML files
│   ├── base.html           # Master template
│   ├── home.html           # Landing page
│   ├── live.html           # Live detection
│   ├── upload.html         # Image upload
│   └── how_it_works.html   # Info page
├── static/
│   ├── css/
│   │   └── style.css       # All styles
│   └── js/
│       ├── navigation.js   # Menu toggle
│       ├── camera.js       # Camera handler
│       ├── app.js          # Live detection
│       ├── upload.js       # Upload handler
│       └── pdf-export.js   # PDF generation
└── models/
    └── best.onnx           # YOLO model
```

## 🛣️ API Endpoints

| Endpoint | Method | Purpose | Docs |
|----------|--------|---------|------|
| `/` | GET | Home page | CODE_DOCUMENTATION.md |
| `/live` | GET | Live detection page | CODE_DOCUMENTATION.md |
| `/upload` | GET | Upload page | CODE_DOCUMENTATION.md |
| `/how-it-works` | GET | Info page | CODE_DOCUMENTATION.md |
| `/process_frame` | POST | Process live frame | CODE_DOCUMENTATION.md |
| `/process_image` | POST | Process uploaded image | CODE_DOCUMENTATION.md |
| `/statistics` | GET | Get statistics | CODE_DOCUMENTATION.md |
| `/reset_statistics` | POST | Reset stats | CODE_DOCUMENTATION.md |
| `/video_feed` | GET | Video stream | CODE_DOCUMENTATION.md |

## 🎨 CSS Variables

```css
/* Colors */
--color-primary: #3b82f6;      /* Blue */
--color-safe: #10b981;         /* Green */
--color-danger: #ef4444;       /* Red */
--color-warning: #f59e0b;      /* Orange */

/* Backgrounds */
--color-bg: #0a0e1a;           /* Dark blue-black */
--color-surface: #1a1f35;      /* Card background */

/* Spacing */
--radius-sm: 0.375rem;         /* 6px */
--radius-md: 0.5rem;           /* 8px */
--radius-lg: 0.75rem;          /* 12px */
```

## 🔧 Common Code Patterns

### Backend - Add Route
```python
@app.route('/endpoint', methods=['POST'])
def handler():
    data = request.json
    return jsonify({'result': 'success'})
```

### Frontend - Extend Template
```html
{% extends "base.html" %}
{% block title %}Page Title{% endblock %}
{% block content %}
    <!-- Content -->
{% endblock %}
```

### JavaScript - Fetch API
```javascript
const response = await fetch('/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
const result = await response.json();
```

### CSS - Component
```css
.component {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: all 0.3s ease;
}
```

## 📱 Responsive Breakpoints

- **Mobile:** ≤ 480px
- **Tablet:** 481px - 1024px
- **Desktop:** > 1024px

## 🎯 Key Classes

### JavaScript
- `CameraHandler` - Camera management
- `exportStatisticsToPDF()` - PDF generation

### CSS
- `.card` - Container component
- `.btn` - Button base
- `.stat-item` - Statistic display
- `.nav-link` - Navigation link

## 🔍 Finding Information

### "Where is...?"
- **Camera code** → DOCS_JAVASCRIPT.md → camera.js
- **Detection logic** → CODE_DOCUMENTATION.md → analyze_detection()
- **Styling** → DOCS_CSS.md → Components
- **Templates** → DOCS_FRONTEND.md

### "How do I...?"
- **Access camera** → DOCS_JAVASCRIPT.md → CameraHandler.start()
- **Process image** → CODE_DOCUMENTATION.md → /process_image
- **Update UI** → DOCS_JAVASCRIPT.md → updateStatistics()
- **Style component** → DOCS_CSS.md → Components

## 🚨 Troubleshooting

| Issue | Solution | Docs |
|-------|----------|------|
| Camera not working | Check HTTPS | CAMERA_FIX.md |
| 404 errors | Restart server | TROUBLESHOOTING.md |
| Styling issues | Check CSS variables | DOCS_CSS.md |
| JavaScript errors | Check console | DOCS_JAVASCRIPT.md |

## 📊 Statistics

- **Total Files:** 12+ code files
- **Total Lines:** 3000+ lines of code
- **Documentation:** 6 comprehensive files
- **Coverage:** 100% of codebase
- **Examples:** 100+ code examples

## 🎓 Learning Order

1. **DOCUMENTATION_INDEX.md** (10 min)
2. **CODE_DOCUMENTATION.md** (60 min)
3. **DOCS_FRONTEND.md** (45 min)
4. **DOCS_JAVASCRIPT.md** (60 min)
5. **DOCS_JAVASCRIPT_PART2.md** (45 min)
6. **DOCS_CSS.md** (45 min)

**Total:** ~4-5 hours for complete understanding

## 💡 Pro Tips

1. **Use Ctrl+F** to search within documentation
2. **Follow cross-references** for related topics
3. **Try code examples** to understand better
4. **Check multiple docs** for complete picture
5. **Update docs** when changing code

## 🔗 External Resources

- **Flask:** https://flask.palletsprojects.com/
- **YOLO:** https://docs.ultralytics.com/
- **OpenCV:** https://docs.opencv.org/
- **MDN:** https://developer.mozilla.org/

## ✅ Checklist for New Features

- [ ] Plan the feature
- [ ] Update backend (CODE_DOCUMENTATION.md)
- [ ] Update frontend (DOCS_FRONTEND.md)
- [ ] Add JavaScript (DOCS_JAVASCRIPT.md)
- [ ] Style with CSS (DOCS_CSS.md)
- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Add to DOCUMENTATION_INDEX.md

---

**Need more details?** → DOCUMENTATION_INDEX.md
**Need help?** → TROUBLESHOOTING.md
**Getting started?** → README.md

---

**Last Updated:** November 2025
**Quick Reference Version:** 1.0
