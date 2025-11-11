// PDF Export functionality using jsPDF
// Note: Requires jsPDF library to be loaded

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
    
    // Environment Status
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Environment Status', 20, 42);
    
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Status: ${environmentText}`, 30, 50);
    doc.text(`Compliance: ${safetyPercentage}`, 30, 57);
    
    // Detection Statistics
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
    
    // Last Violation
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Last Violation', 20, 121);
    
    doc.setFontSize(11);
    doc.setTextColor(60);
    const violationLines = doc.splitTextToSize(lastViolation, 160);
    doc.text(violationLines, 30, 129);
    
    // Summary Box
    const boxY = 145;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, boxY, 170, 30, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.text('Summary', 105, boxY + 10, { align: 'center' });
    
    doc.setFontSize(10);
    const summaryText = `${compliant} out of ${total} people (${compliance}%) wearing masks correctly`;
    doc.text(summaryText, 105, boxY + 20, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('MaskGuard Detection System - Developed by Aina', 105, 280, { align: 'center' });
    doc.text('© 2025 All Rights Reserved', 105, 285, { align: 'center' });
    
    // Save the PDF
    const filename = `MaskGuard_Report_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}.pdf`;
    doc.save(filename);
}

// Export function for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportStatisticsToPDF };
}
