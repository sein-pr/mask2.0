# 📄 PDF Export Feature

## Overview

The PDF export feature allows you to download a comprehensive report of the current detection statistics.

## How to Use

### On Live Detection Page

1. **Navigate to Live Detection:**
   ```
   http://localhost:5000/live
   ```

2. **Run some detections** to gather statistics

3. **Click the "Export PDF" button** in the controls section

4. **PDF will download automatically** with filename format:
   ```
   MaskGuard_Report_2025-11-08_15-30.pdf
   ```

## What's Included in the PDF

The exported PDF report contains:

### 1. Header
- Report title
- Generation date and time

### 2. Environment Status
- Current environment status (Safe/Unsafe)
- Compliance percentage

### 3. Detection Statistics
- ✓ With Mask (count)
- ✗ Without Mask (count)
- ⚠ Incorrect Mask (count)
- Total Detections (count)

### 4. Last Violation
- Timestamp of last violation
- Or "No violations detected"

### 5. Summary
- Overall compliance summary
- Percentage calculation

### 6. Footer
- System information
- Copyright notice

## PDF Features

- **Professional Layout** - Clean, organized design
- **Color-Coded** - Green for safe, red for violations, orange for warnings
- **Timestamped** - Exact date and time of report generation
- **Unique Filenames** - Each export has a unique timestamp filename

## Troubleshooting

### PDF Not Downloading

**Issue:** Clicking "Export PDF" does nothing

**Solutions:**

1. **Check browser console** (F12 → Console):
   - Look for JavaScript errors
   - Check if jsPDF library loaded

2. **Check browser pop-up blocker:**
   - Allow pop-ups for localhost
   - Check browser download settings

3. **Try different browser:**
   - Chrome usually works best
   - Firefox and Edge also supported

4. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Or use Incognito/Private mode

### "PDF library not loaded" Error

**Solution:**

1. **Check internet connection** (jsPDF loads from CDN)

2. **Refresh the page:**
   ```
   Ctrl+F5 (hard refresh)
   ```

3. **Check if CDN is accessible:**
   - Open browser console
   - Look for network errors

### PDF Shows Wrong Data

**Issue:** PDF shows zeros or old data

**Solution:**

1. **Wait for statistics to update:**
   - Statistics update every second
   - Make sure detections are running

2. **Check if detection is paused:**
   - Resume detection before exporting

3. **Refresh the page and try again**

## Browser Compatibility

| Browser | Version | PDF Export |
|---------|---------|------------|
| Chrome | 60+ | ✅ Full Support |
| Firefox | 55+ | ✅ Full Support |
| Safari | 11+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |

## Technical Details

### Library Used
- **jsPDF** v2.5.1
- Loaded from CDN: `cdnjs.cloudflare.com`

### File Format
- **Format:** PDF (Portable Document Format)
- **Size:** ~10-20 KB
- **Pages:** 1 page

### Filename Format
```
MaskGuard_Report_YYYY-MM-DD_HH-MM.pdf
```

Example:
```
MaskGuard_Report_2025-11-08_15-30.pdf
```

## Customization

Want to customize the PDF? Edit `static/js/pdf-export.js`:

### Change Colors
```javascript
doc.setTextColor(59, 130, 246); // RGB values
```

### Change Font Size
```javascript
doc.setFontSize(20); // Size in points
```

### Add More Information
```javascript
doc.text('Your custom text', x, y);
```

### Change Layout
```javascript
doc.text('Text', x, y, { align: 'center' });
```

## Example Use Cases

### 1. Daily Reports
- Export at end of each day
- Keep records of compliance

### 2. Incident Documentation
- Export when violations occur
- Attach to incident reports

### 3. Compliance Audits
- Generate reports for auditors
- Show compliance trends

### 4. Management Reports
- Weekly/monthly summaries
- Share with stakeholders

## Tips

1. **Export regularly** to track trends over time

2. **Name your files** - Rename after download for better organization

3. **Store securely** - Keep reports in a secure location

4. **Compare reports** - Track improvements over time

5. **Share easily** - PDF format is universal and easy to share

## Future Enhancements

Potential features for future versions:

- [ ] Multi-page reports with charts
- [ ] Historical data comparison
- [ ] Custom date range selection
- [ ] Email report directly
- [ ] Schedule automatic exports
- [ ] Add company logo
- [ ] Include detection images
- [ ] Export to Excel/CSV

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify internet connection (for CDN)
3. Try different browser
4. Clear cache and refresh
5. See TROUBLESHOOTING.md for more help

## Quick Test

1. Go to Live Detection page
2. Let it detect for a few seconds
3. Click "Export PDF"
4. Check your Downloads folder

You should see a PDF file with your statistics!

---

**Note:** The PDF export feature requires an internet connection to load the jsPDF library from CDN. For offline use, you can download the library locally.
