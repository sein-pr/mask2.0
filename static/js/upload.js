// Upload page functionality
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

// Browse button click
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

// Upload area click
uploadArea.addEventListener('click', (e) => {
    if (e.target !== browseBtn) {
        fileInput.click();
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--color-primary)';
    uploadArea.style.background = 'var(--color-primary-glow)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file upload
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

// Process image
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

// Update summary statistics
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

// Upload another button
uploadAnotherBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    fileInput.value = '';
    originalImage.src = '';
    processedImage.src = '';
});
