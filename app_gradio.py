"""
MaskGuard - Gradio Version for Hugging Face Spaces
Developed by Aina
"""

import gradio as gr
import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image
import base64

# Load YOLO model
print("Loading model...")
model = YOLO("models/best.onnx", task='detect')
print("Model loaded!")

# Global tracking variables
tracked_objects = {}
counted_ids = set()
statistics = {
    'with_mask': 0,
    'without_mask': 0,
    'incorrect_mask': 0
}

def process_frame(image):
    """Process image from webcam and return annotated image"""
    global tracked_objects, counted_ids, statistics
    
    if image is None:
        return None
    
    # Convert PIL to OpenCV format
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Run YOLO tracking
    results = model.track(frame, conf=0.5, iou=0.7, persist=True, verbose=False)
    
    # Analyze detections
    current_frame_ids = set()
    unsafe_count = 0
    
    for result in results:
        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                class_name = result.names[cls_id].lower()
                
                # Get track ID
                track_id = None
                if hasattr(box, 'id') and box.id is not None:
                    track_id = int(box.id[0])
                    current_frame_ids.add(track_id)
                
                # Determine status
                is_unsafe = False
                status_text = ""
                detection_category = None
                
                if 'no_mask' in class_name or 'without_mask' in class_name:
                    is_unsafe = True
                    status_text = "No Mask"
                    detection_category = 'without_mask'
                    unsafe_count += 1
                elif 'incorrect' in class_name or 'improper' in class_name:
                    is_unsafe = True
                    status_text = "Incorrect Mask"
                    detection_category = 'incorrect_mask'
                    unsafe_count += 1
                elif 'mask' in class_name or 'with_mask' in class_name:
                    status_text = "Mask OK"
                    detection_category = 'with_mask'
                
                # Track new IDs
                if track_id is not None and track_id not in counted_ids:
                    counted_ids.add(track_id)
                    if detection_category == 'with_mask':
                        statistics['with_mask'] += 1
                    elif detection_category == 'without_mask':
                        statistics['without_mask'] += 1
                    elif detection_category == 'incorrect_mask':
                        statistics['incorrect_mask'] += 1
                
                # Store tracking info
                if track_id is not None:
                    tracked_objects[track_id] = {
                        'status': 'unsafe' if is_unsafe else 'safe',
                        'status_text': status_text
                    }
    
    # Remove old IDs
    ids_to_remove = [tid for tid in tracked_objects.keys() if tid not in current_frame_ids]
    for tid in ids_to_remove:
        del tracked_objects[tid]
    
    # Draw custom annotations
    annotated_frame = frame.copy()
    
    for result in results:
        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                track_id = None
                if hasattr(box, 'id') and box.id is not None:
                    track_id = int(box.id[0])
                
                # Determine color and label
                if track_id is not None and track_id in tracked_objects:
                    obj_info = tracked_objects[track_id]
                    if obj_info['status'] == 'unsafe':
                        color = (0, 0, 255)  # Red
                        label = f"ID:{track_id} - {obj_info['status_text']} ⚠"
                    else:
                        color = (0, 255, 0)  # Green
                        label = f"ID:{track_id} - {obj_info['status_text']}"
                else:
                    color = (255, 255, 0)
                    label = "Detecting..."
                
                # Draw box
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                
                # Draw label
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                cv2.rectangle(annotated_frame, 
                            (x1, y1 - label_size[1] - 10), 
                            (x1 + label_size[0], y1), 
                            color, -1)
                cv2.putText(annotated_frame, label, (x1, y1 - 5), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    # Draw warning if > 2 unsafe
    if unsafe_count > 2:
        warning = "⚠ ENVIRONMENT NOT SAFE ⚠"
        text_size, _ = cv2.getTextSize(warning, cv2.FONT_HERSHEY_SIMPLEX, 1.0, 3)
        x = (annotated_frame.shape[1] - text_size[0]) // 2
        cv2.rectangle(annotated_frame, (x - 10, 30), (x + text_size[0] + 10, 70), (0, 0, 255), -1)
        cv2.putText(annotated_frame, warning, (x, 60), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 3)
    
    # Convert back to PIL
    return Image.fromarray(cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB))

def get_stats():
    """Return current statistics"""
    total = statistics['with_mask'] + statistics['without_mask'] + statistics['incorrect_mask']
    return f"""
    📊 **Statistics**
    - ✅ With Mask: {statistics['with_mask']}
    - ❌ Without Mask: {statistics['without_mask']}
    - ⚠️ Incorrect Mask: {statistics['incorrect_mask']}
    - 👥 Total People: {total}
    - 🎯 Unique IDs Tracked: {len(counted_ids)}
    """

def reset_stats():
    """Reset all statistics"""
    global statistics, counted_ids, tracked_objects
    statistics = {'with_mask': 0, 'without_mask': 0, 'incorrect_mask': 0}
    counted_ids.clear()
    tracked_objects.clear()
    return "Statistics reset!"

# Create Gradio interface
with gr.Blocks(title="MaskGuard Detection", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🎭 MaskGuard - Real-Time Mask Detection
    ### AI-powered face mask compliance monitoring
    **Developed by Aina**
    
    📱 Works on mobile & desktop | 🎥 Uses your device camera | ⚡ Real-time detection
    """)
    
    with gr.Row():
        with gr.Column(scale=2):
            webcam = gr.Image(source="webcam", streaming=True, label="Live Camera Feed")
            output = gr.Image(label="Detection Results")
        
        with gr.Column(scale=1):
            stats_display = gr.Markdown(get_stats())
            with gr.Row():
                reset_btn = gr.Button("🔄 Reset Statistics", variant="secondary")
            
            gr.Markdown("""
            ### 🎯 How It Works
            1. **Green Box** = Mask worn correctly ✅
            2. **Red Box** = No mask or incorrect ❌
            3. Each person gets unique ID
            4. Warning if >2 people unsafe
            
            ### 📱 Mobile Instructions
            - Allow camera access
            - Use front or back camera
            - Works on any device!
            """)
    
    # Process webcam stream
    webcam.stream(
        fn=process_frame,
        inputs=webcam,
        outputs=output,
        stream_every=0.5,  # Process every 0.5 seconds
        show_progress=False
    )
    
    # Update stats periodically
    demo.load(
        fn=get_stats,
        inputs=None,
        outputs=stats_display,
        every=2  # Update every 2 seconds
    )
    
    # Reset button
    reset_btn.click(
        fn=reset_stats,
        inputs=None,
        outputs=None
    ).then(
        fn=get_stats,
        inputs=None,
        outputs=stats_display
    )

# Launch
if __name__ == "__main__":
    demo.launch(
        share=False,  # Set to True for temporary public link
        server_name="0.0.0.0",
        server_port=7860
    )

