from flask import Flask, render_template, Response, jsonify, request
from ultralytics import YOLO
import cv2
import threading
import time
from collections import deque
from datetime import datetime
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)

# Load YOLO model
model = YOLO("models/best.onnx", task='detect')

# Global variables
camera = None
detection_active = True
detection_paused = False
statistics = {
    'total_detections': 0,
    'with_mask': 0,
    'without_mask': 0,
    'incorrect_mask': 0,
    'current_status': 'safe',
    'last_violation': None,
    'detection_history': deque(maxlen=100)  # Keep last 100 detections
}
# Track object IDs and their mask status
tracked_objects = {}  # {track_id: {'status': 'safe'/'unsafe', 'class_name': str, 'alerted': bool, 'category': str}}
# Track which IDs have been counted to prevent duplicate counting
counted_ids = set()  # Set of track IDs that have already been counted in statistics
lock = threading.Lock()

def get_camera():
    """Initialize camera if not already done"""
    global camera
    try:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
            if not camera.isOpened():
                print("Error: Could not open camera")
                return None
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        return camera
    except Exception as e:
        print(f"Error initializing camera: {e}")
        return None

def analyze_detection(results):
    """Analyze detection results and update statistics - count each unique ID only once"""
    global statistics, tracked_objects, counted_ids
    
    with lock:
        current_violations = []
        current_frame_ids = set()
        new_alerts = []
        unsafe_count = 0  # Count of people not wearing mask correctly in current frame
        
        # Track new unique detections for this frame
        new_unique_with_mask = 0
        new_unique_without_mask = 0
        new_unique_incorrect_mask = 0
        
        for result in results:
            if result.boxes is not None and len(result.boxes) > 0:
                for box in result.boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    # Get class name
                    class_name = result.names[cls_id].lower()
                    
                    # Get track ID if available
                    track_id = None
                    if hasattr(box, 'id') and box.id is not None:
                        track_id = int(box.id[0])
                        current_frame_ids.add(track_id)
                    
                    # Determine status
                    is_unsafe = False
                    status_text = ""
                    detection_category = None
                    
                    # Check negative cases first to avoid false matches
                    if 'no_mask' in class_name or 'without_mask' in class_name or 'not_wearing' in class_name or 'no mask' in class_name:
                        is_unsafe = True
                        status_text = "No Mask"
                        detection_category = 'without_mask'
                        unsafe_count += 1
                        current_violations.append('No Mask Detected')
                    elif 'incorrect' in class_name or 'improper' in class_name or 'mask_weared_incorrect' in class_name:
                        is_unsafe = True
                        status_text = "Incorrect Mask"
                        detection_category = 'incorrect_mask'
                        unsafe_count += 1
                        current_violations.append('Incorrect Mask Detected')
                    elif 'mask' in class_name or 'with_mask' in class_name or 'wearing_mask' in class_name:
                        status_text = "Mask OK"
                        detection_category = 'with_mask'
                    
                    # Track object status changes
                    if track_id is not None:
                        # Check if this is a NEW unique ID we haven't counted before
                        is_new_unique_id = track_id not in counted_ids
                        
                        if track_id not in tracked_objects:
                            # Brand new object detected for the first time
                            tracked_objects[track_id] = {
                                'status': 'unsafe' if is_unsafe else 'safe',
                                'class_name': class_name,
                                'status_text': status_text,
                                'alerted': False,
                                'category': detection_category
                            }
                            
                            # Count this person ONLY ONCE when first detected
                            if is_new_unique_id:
                                counted_ids.add(track_id)
                                if detection_category == 'with_mask':
                                    new_unique_with_mask += 1
                                elif detection_category == 'without_mask':
                                    new_unique_without_mask += 1
                                elif detection_category == 'incorrect_mask':
                                    new_unique_incorrect_mask += 1
                            
                            if is_unsafe:
                                new_alerts.append(track_id)
                                tracked_objects[track_id]['alerted'] = True
                        else:
                            # Existing tracked object
                            old_status = tracked_objects[track_id]['status']
                            old_category = tracked_objects[track_id].get('category')
                            new_status = 'unsafe' if is_unsafe else 'safe'
                            
                            # If the person's mask status category changed, update counts
                            if old_category != detection_category and old_category is not None:
                                # Decrement the old category
                                if old_category == 'with_mask':
                                    statistics['with_mask'] = max(0, statistics['with_mask'] - 1)
                                elif old_category == 'without_mask':
                                    statistics['without_mask'] = max(0, statistics['without_mask'] - 1)
                                elif old_category == 'incorrect_mask':
                                    statistics['incorrect_mask'] = max(0, statistics['incorrect_mask'] - 1)
                                
                                # Increment the new category
                                if detection_category == 'with_mask':
                                    new_unique_with_mask += 1
                                elif detection_category == 'without_mask':
                                    new_unique_without_mask += 1
                                elif detection_category == 'incorrect_mask':
                                    new_unique_incorrect_mask += 1
                            
                            if old_status != new_status:
                                tracked_objects[track_id]['status'] = new_status
                                tracked_objects[track_id]['class_name'] = class_name
                                tracked_objects[track_id]['status_text'] = status_text
                                tracked_objects[track_id]['category'] = detection_category
                                
                                if new_status == 'unsafe':
                                    # Status changed from safe to unsafe - trigger alert
                                    new_alerts.append(track_id)
                                    tracked_objects[track_id]['alerted'] = True
                                else:
                                    # Status changed from unsafe to safe - reset alert
                                    tracked_objects[track_id]['alerted'] = False
                            else:
                                # Update status text and category
                                tracked_objects[track_id]['status_text'] = status_text
                                tracked_objects[track_id]['category'] = detection_category
        
        # Remove objects that are no longer in frame from tracking
        # But keep them in counted_ids to maintain accurate unique count
        ids_to_remove = [tid for tid in tracked_objects.keys() if tid not in current_frame_ids]
        for tid in ids_to_remove:
            del tracked_objects[tid]
        
        # Update statistics ONLY for new unique detections
        if new_unique_with_mask > 0 or new_unique_without_mask > 0 or new_unique_incorrect_mask > 0:
            statistics['with_mask'] += new_unique_with_mask
            statistics['without_mask'] += new_unique_without_mask
            statistics['incorrect_mask'] += new_unique_incorrect_mask
            statistics['total_detections'] = len(counted_ids)  # Total unique people ever detected
            
            # Add to history
            statistics['detection_history'].append({
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'with_mask': statistics['with_mask'],
                'without_mask': statistics['without_mask'],
                'incorrect_mask': statistics['incorrect_mask']
            })
        
        # Determine current status based on current frame
        alert_data = {
            'new_alerts': new_alerts,
            'unsafe_count': unsafe_count,
            'environment_unsafe': unsafe_count > 2
        }
        
        if unsafe_count > 0:
            statistics['current_status'] = 'unsafe'
            statistics['last_violation'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        else:
            statistics['current_status'] = 'safe'
        
        return alert_data

def generate_frames():
    """Generate video frames with detection"""
    global detection_paused, tracked_objects
    
    cam = get_camera()
    if cam is None:
        print("Failed to initialize camera")
        return
    
    try:
        while detection_active:
            if detection_paused:
                time.sleep(0.1)
                continue
            
            try:
                success, frame = cam.read()
                if not success:
                    print("Failed to read frame from camera")
                    time.sleep(0.1)
                    continue
                
                # Run YOLO tracking (instead of just detection)
                results = model.track(frame, conf=0.5, iou=0.7, persist=True, verbose=False)
                
                # Analyze detections
                alert_data = analyze_detection(results)
                
                # Draw custom bounding boxes with colors based on tracked status
                annotated_frame = frame.copy()
                
                for result in results:
                    if result.boxes is not None and len(result.boxes) > 0:
                        for box in result.boxes:
                            # Get box coordinates
                            x1, y1, x2, y2 = map(int, box.xyxy[0])
                            
                            # Get track ID
                            track_id = None
                            if hasattr(box, 'id') and box.id is not None:
                                track_id = int(box.id[0])
                            
                            # Get confidence
                            conf = float(box.conf[0])
                            
                            # Determine color and label based on tracked status
                            if track_id is not None and track_id in tracked_objects:
                                obj_info = tracked_objects[track_id]
                                if obj_info['status'] == 'unsafe':
                                    color = (0, 0, 255)  # Red for unsafe
                                    label = f"ID:{track_id} - {obj_info['status_text']} ⚠ ALERT"
                                else:
                                    color = (0, 255, 0)  # Green for safe
                                    label = f"ID:{track_id} - {obj_info['status_text']}"
                            else:
                                # Default for objects without track ID
                                color = (255, 255, 0)  # Yellow
                                label = "Detecting..."
                            
                            # Draw bounding box
                            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                            
                            # Draw label background
                            label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                            cv2.rectangle(annotated_frame, 
                                        (x1, y1 - label_size[1] - 10), 
                                        (x1 + label_size[0], y1), 
                                        color, -1)
                            
                            # Draw label text
                            cv2.putText(annotated_frame, label, 
                                      (x1, y1 - 5), 
                                      cv2.FONT_HERSHEY_SIMPLEX, 
                                      0.6, (255, 255, 255), 2)
                
                # Draw environment warning if > 2 people unsafe
                if alert_data['environment_unsafe']:
                    warning_text = "⚠ ENVIRONMENT NOT SAFE ⚠"
                    text_size, _ = cv2.getTextSize(warning_text, cv2.FONT_HERSHEY_SIMPLEX, 1.2, 3)
                    x = (annotated_frame.shape[1] - text_size[0]) // 2
                    y = 50
                    
                    # Draw warning background
                    cv2.rectangle(annotated_frame, 
                                (x - 10, y - text_size[1] - 10), 
                                (x + text_size[0] + 10, y + 10), 
                                (0, 0, 255), -1)
                    
                    # Draw warning text
                    cv2.putText(annotated_frame, warning_text, 
                              (x, y), 
                              cv2.FONT_HERSHEY_SIMPLEX, 
                              1.2, (255, 255, 255), 3)
                
                # Encode frame
                ret, buffer = cv2.imencode('.jpg', annotated_frame)
                if not ret:
                    continue
                    
                frame_bytes = buffer.tobytes()
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                       
            except Exception as e:
                print(f"Error processing frame: {e}")
                time.sleep(0.1)
                continue
                
    except GeneratorExit:
        print("Client disconnected from video stream")
    except Exception as e:
        print(f"Error in generate_frames: {e}")
    finally:
        print("Video stream ended")

@app.route('/')
def index():
    """Render main page"""
    return render_template('index.html')

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'camera_active': camera is not None})

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    try:
        return Response(generate_frames(),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    except Exception as e:
        print(f"Error in video_feed route: {e}")
        return str(e), 500

@app.route('/toggle_detection', methods=['POST'])
def toggle_detection():
    """Toggle detection pause/resume"""
    global detection_paused
    with lock:
        detection_paused = not detection_paused
    return jsonify({'paused': detection_paused})

@app.route('/statistics')
def get_statistics():
    """Get current statistics"""
    try:
        # Try to acquire lock with timeout to prevent hanging
        if lock.acquire(timeout=1):
            try:
                stats = statistics.copy()
                # Convert deque to list for JSON serialization
                stats['detection_history'] = list(stats['detection_history'])
                
                # Calculate safety percentage
                total = stats['with_mask'] + stats['without_mask'] + stats['incorrect_mask']
                if total > 0:
                    stats['safety_percentage'] = round((stats['with_mask'] / total) * 100, 1)
                else:
                    stats['safety_percentage'] = 100
                
                # Add alert information
                unsafe_count = sum(1 for obj in tracked_objects.values() if obj['status'] == 'unsafe')
                stats['unsafe_count'] = unsafe_count
                stats['environment_unsafe'] = unsafe_count > 2
                stats['tracked_count'] = len(tracked_objects)
                
                return jsonify(stats)
            finally:
                lock.release()
        else:
            # If we can't get the lock, return the last known state
            return jsonify({
                'total_detections': 0,
                'with_mask': 0,
                'without_mask': 0,
                'incorrect_mask': 0,
                'current_status': 'safe',
                'safety_percentage': 100,
                'unsafe_count': 0,
                'environment_unsafe': False,
                'tracked_count': 0,
                'detection_history': []
            })
    except Exception as e:
        print(f"Error in get_statistics: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/reset_statistics', methods=['POST'])
def reset_statistics():
    """Reset statistics and counted IDs"""
    global statistics, counted_ids, tracked_objects
    with lock:
        statistics = {
            'total_detections': 0,
            'with_mask': 0,
            'without_mask': 0,
            'incorrect_mask': 0,
            'current_status': 'safe',
            'last_violation': None,
            'detection_history': deque(maxlen=100)
        }
        # Clear the counted IDs to allow fresh counting
        counted_ids.clear()
        # Clear tracked objects
        tracked_objects.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    print("="*60)
    print("MaskGuard Detection System - Starting...")
    print("="*60)
    print(f"Model loaded: models/best.onnx")
    print(f"Server will run on: http://127.0.0.1:5000")
    print(f"Debug mode: ON (use_reloader=False)")
    print("="*60)
    
    try:
        # Run with use_reloader=False to prevent camera conflicts
        app.run(debug=True, host='0.0.0.0', port=5000, threaded=True, use_reloader=False)
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    except Exception as e:
        print(f"Server error: {e}")
    finally:
        detection_active = False
        print("Releasing camera...")
        if camera is not None:
            camera.release()
            cv2.destroyAllWindows()
        print("Server stopped.")
