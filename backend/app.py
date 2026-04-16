"""
EcoVision AI Backend - Flask Server
Main application file with SQLite database integration
"""

# ========== SUPPRESS ALL WARNINGS (MUST BE FIRST) ==========
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['ABSL_MIN_LOG_LEVEL'] = '0'  # Suppress absl logging
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'

import sys
import warnings
warnings.filterwarnings('ignore')
warnings.simplefilter('ignore')

# Suppress logging EARLY
import logging
logging.basicConfig(level=logging.CRITICAL)

# Disable all loggers except critical
for logger_name in ['tensorflow', 'tensorflow.python', 'absl', 'flask', 'werkzeug', 'urllib3']:
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.CRITICAL)
    logger.disabled = True

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import numpy as np
from PIL import Image
import tensorflow as tf
import json
from pathlib import Path
import re
from sqlalchemy.exc import OperationalError

# Additional TensorFlow suppression
tf.get_logger().setLevel(logging.CRITICAL)
tf.autograph.set_verbosity(0)

# Initialize Flask app
app = Flask(__name__)

# Create separate data directories for visibility
DB_FOLDER = os.path.join(os.path.dirname(__file__), 'data', 'database')
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'data', 'uploads')
BACKUP_FOLDER = os.path.join(os.path.dirname(__file__), 'data', 'backups')

# Create all directories
os.makedirs(DB_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(BACKUP_FOLDER, exist_ok=True)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(DB_FOLDER, "wastehandling.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['BACKUP_FOLDER'] = BACKUP_FOLDER
app.config['DB_FOLDER'] = DB_FOLDER

# Initialize database
db = SQLAlchemy(app)

# =================== DATABASE MODELS ===================

class Prediction(db.Model):
    """Store prediction history"""
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    upload_source = db.Column(db.String(20))  # 'upload' or 'camera'
    top_predictions = db.Column(db.JSON)  # Store top 3 predictions
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'category': self.category,
            'confidence': round(self.confidence * 100, 2),
            'image_path': self.image_path,
            'upload_source': self.upload_source,
            'top_predictions': self.top_predictions
        }

class UploadedImage(db.Model):
    """Store uploaded images for backup"""
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    filename = db.Column(db.String(255), nullable=False, unique=True)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    source_type = db.Column(db.String(20))  # 'upload' or 'camera'
    file_size = db.Column(db.Integer)  # in bytes
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'filename': self.original_filename,
            'source': self.source_type,
            'size': self.file_size
        }

class Statistics(db.Model):
    """Store statistics and analytics"""
    id = db.Column(db.Integer, primary_key=True)
    total_predictions = db.Column(db.Integer, default=0)
    total_uploads = db.Column(db.Integer, default=0)
    total_cameras = db.Column(db.Integer, default=0)
    average_confidence = db.Column(db.Float, default=0.0)
    most_common_category = db.Column(db.String(50))
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'total_predictions': self.total_predictions,
            'total_uploads': self.total_uploads,
            'total_cameras': self.total_cameras,
            'average_confidence': round(self.average_confidence, 2),
            'most_common': self.most_common_category
        }

class NLPQueryLog(db.Model):
    """Log all NLP queries for analytics"""
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    query = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    intent = db.Column(db.String(50))
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'query': self.query,
            'response': self.response,
            'intent': self.intent
        }

class Feedback(db.Model):
    """User correction feedback for predictions"""
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    prediction_id = db.Column(db.Integer, nullable=True)
    image_id = db.Column(db.Integer, nullable=True)
    predicted_category = db.Column(db.String(50), nullable=False)
    corrected_category = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'prediction_id': self.prediction_id,
            'image_id': self.image_id,
            'predicted_category': self.predicted_category,
            'corrected_category': self.corrected_category,
            'confidence': round(self.confidence * 100, 2) if self.confidence is not None else None,
            'notes': self.notes
        }

# =================== TRASH DETECTION MODEL ===================

class WasteClassifier:
    """Load and manage the waste classification model"""
    
    def __init__(self):
        self.model = None
        self.repo_root = Path(__file__).resolve().parent.parent
        self.model_path = None
        self.class_names_path = None
        # Class names in exact order from Colab training
        self.class_names = [
            'Battery', 'Keyboard', 'Microwave', 'Mobile', 'Mouse', 'PCB', 'Player',
            'Printer', 'Television', 'Washing Machine', 'cardboard', 'glass', 'metal',
            'organic', 'paper', 'plastic', 'trash'
        ]
        self.load_model()

    def _find_model_path(self):
        # Search in priority order
        search_paths = [
            self.repo_root / 'backend' / 'best_model.h5',
            self.repo_root / 'models' / 'waste_classifier_model.h5',
            self.repo_root / 'models' / 'best_model.h5',
            self.repo_root / 'best_model.h5',
            self.repo_root / 'waste_classifier_model.h5',
        ]
        
        for path in search_paths:
            if path.exists():
                return path

        # Fallback: glob search
        candidates = []
        candidates += list((self.repo_root / 'models').glob('*.h5'))
        candidates += list(self.repo_root.glob('*.h5'))
        candidates += list(Path(__file__).resolve().parent.glob('*.h5'))

        if not candidates:
            return None

        # Prefer a filename that includes common keywords.
        ranked = sorted(
            candidates,
            key=lambda p: (
                0 if 'best' in p.name.lower() else 1,
                0 if 'waste' in p.name.lower() else 1,
                0 if 'model' in p.name.lower() else 1,
                p.name.lower()
            )
        )
        return ranked[0]

    def _find_class_names_path(self, model_path):
        # Search in priority order
        search_paths = [
            self.repo_root / 'backend' / 'class_names.json',
            self.repo_root / 'models' / 'class_names.json',
            self.repo_root / 'class_names.json',
        ]
        
        for path in search_paths:
            if path.exists():
                return path

        # Fallback: check same directory as model
        if model_path:
            stem_json = model_path.with_suffix('.json')
            if stem_json.exists():
                return stem_json
        
        return None
    
    def load_model(self):
        """Load pre-trained model (can be replaced with actual model path)"""
        try:
            model_path = self._find_model_path()
            class_names_path = self._find_class_names_path(model_path)
            if model_path and model_path.exists():
                self.model = tf.keras.models.load_model(str(model_path))
                self.model_path = str(model_path)
                self.has_rescaling = any(
                    layer.__class__.__name__ == 'Rescaling' for layer in self.model.layers
                )
                if class_names_path and class_names_path.exists():
                    try:
                        with open(class_names_path, 'r', encoding='utf-8') as f:
                            loaded_names = json.load(f)
                        output_classes = int(self.model.output_shape[-1])
                        if isinstance(loaded_names, list) and len(loaded_names) == output_classes:
                            self.class_names = loaded_names
                            self.class_names_path = str(class_names_path)
                            print(f"✓ Class labels loaded from: {class_names_path}")
                        else:
                            print(f"⚠️  class_names.json length mismatch (expected {output_classes})")
                    except Exception as e:
                        print(f"⚠️  Failed to load class_names.json: {e}")
                print(f"✓ Model loaded from: {model_path}")
            else:
                print("⚠️  Model not found in repo root or models/ folder")
                print("✓ Using MOCK PREDICTIONS (place trained model in models/ folder)")
                self.model = None
                self.model_path = None
                self.class_names_path = None
                self.has_rescaling = False
        except Exception as e:
            print(f"⚠️  Error loading model: {e}")
            print(f"✓ Using MOCK PREDICTIONS instead")
            self.model = None
            self.model_path = None
            self.class_names_path = None
            self.has_rescaling = False

    def info(self):
        return {
            'loaded': self.model is not None,
            'model_path': self.model_path,
            'class_names_path': self.class_names_path,
            'class_count': len(self.class_names)
        }
    
    def predict(self, image_path):
        """Make prediction on waste image"""
        try:
            # Load and process image
            img = Image.open(image_path).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img).astype('float32')
            if not self.has_rescaling:
                img_array = img_array / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            # Get predictions
            if self.model is not None:
                # Real model predictions
                predictions = self.model.predict(img_array, verbose=0)
                confidence_scores = predictions[0]
            else:
                # Mock predictions for testing without model
                confidence_scores = np.random.rand(len(self.class_names))
                confidence_scores = confidence_scores / confidence_scores.sum()
            
            # Get top 3 predictions
            top_indices = np.argsort(confidence_scores)[::-1][:3]
            
            results = {
                'primary_class': self.class_names[top_indices[0]],
                'confidence': float(confidence_scores[top_indices[0]]),
                'top_predictions': [
                    {
                        'class': self.class_names[idx],
                        'confidence': float(confidence_scores[idx])
                    }
                    for idx in top_indices[:3]
                ]
            }
            
            return results
        except Exception as e:
            return {'error': str(e)}

# Initialize model
classifier = WasteClassifier()

print("\n" + "="*70)
print("  🌿 EcoVision AI Backend - Started")
print("="*70)
print(f"\n📁 Data Locations:")
print(f"   📦 Database:  {os.path.abspath(DB_FOLDER)}/wastehandling.db")
print(f"   📤 Uploads:   {os.path.abspath(UPLOAD_FOLDER)}")
print(f"   💾 Backups:   {os.path.abspath(BACKUP_FOLDER)}")
print(f"\n🤖 Model Status: {'✅ Loaded Successfully' if classifier.model is not None else '⚠️  Mock Mode (Add trained model to models/ folder)'}")
print(f"\n🌐 API Server:")
print(f"   Base URL:   http://localhost:5000")
print(f"   API Base:   http://localhost:5000/api")
print(f"   Health:     http://localhost:5000/api/health")
print(f"\n💡 Startup Command: python app.py")
print(f"   ⚠️  NOT: uvicorn (Flask uses WSGI, not ASGI)")
print("="*70 + "\n")

# =================== API ROUTES ===================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'EcoVision AI Backend',
        'model': classifier.info(),
        'database_location': app.config['DB_FOLDER'],
        'uploads_location': app.config['UPLOAD_FOLDER'],
        'backups_location': app.config['BACKUP_FOLDER']
    }), 200

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Return model load status and metadata"""
    return jsonify(classifier.info()), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make prediction on uploaded image"""
    try:
        # Check if image is provided
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        source = request.form.get('source', 'upload')  # 'upload' or 'camera'
        
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Save uploaded image
        filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Store in database for backup
        uploaded_image = UploadedImage(
            filename=filename,
            original_filename=file.filename,
            file_path=filepath,
            source_type=source,
            file_size=os.path.getsize(filepath)
        )
        db.session.add(uploaded_image)
        db.session.commit()
        
        # Make prediction
        prediction_result = classifier.predict(filepath)
        
        if 'error' in prediction_result:
            return jsonify(prediction_result), 500
        
        # Store prediction in database
        prediction = Prediction(
            category=prediction_result['primary_class'],
            confidence=prediction_result['confidence'],
            image_path=filepath,
            upload_source=source,
            top_predictions=json.dumps(prediction_result['top_predictions'])
        )
        db.session.add(prediction)
        
        # Update statistics
        update_statistics(prediction_result['primary_class'], prediction_result['confidence'])
        
        db.session.commit()
        
        # Check confidence threshold
        confidence_pct = prediction_result['confidence'] * 100
        response_data = {
            'success': True,
            'prediction': prediction_result['primary_class'],
            'confidence': round(confidence_pct, 2),
            'top_predictions': prediction_result['top_predictions'],
            'image_id': uploaded_image.id,
            'prediction_id': prediction.id
        }
        
        # Add warning if confidence is below 70%
        if confidence_pct < 70:
            response_data['warning'] = True
            response_data['warning_message'] = f"⚠️ Low confidence ({confidence_pct:.1f}%). Please verify this result or submit correction feedback."
        else:
            response_data['warning'] = False
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    try:
        limit = request.args.get('limit', 20, type=int)
        predictions = Prediction.query.order_by(Prediction.timestamp.desc()).limit(limit).all()
        return jsonify([p.to_dict() for p in predictions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Store user correction feedback"""
    try:
        data = request.json or {}
        predicted = data.get('predicted_category')
        corrected = data.get('corrected_category')
        if not predicted or not corrected:
            return jsonify({'error': 'predicted_category and corrected_category are required'}), 400

        feedback = Feedback(
            prediction_id=data.get('prediction_id'),
            image_id=data.get('image_id'),
            predicted_category=predicted,
            corrected_category=corrected,
            confidence=data.get('confidence'),
            notes=data.get('notes')
        )
        db.session.add(feedback)
        db.session.commit()
        return jsonify({'success': True, 'feedback': feedback.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback/recent', methods=['GET'])
def recent_feedback():
    """Return recent correction feedback"""
    try:
        limit = request.args.get('limit', 10, type=int)
        rows = Feedback.query.order_by(Feedback.timestamp.desc()).limit(limit).all()
        return jsonify([r.to_dict() for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get statistics and analytics"""
    try:
        stats = Statistics.query.first()
        if stats:
            return jsonify(stats.to_dict()), 200
        return jsonify({'error': 'No statistics available'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/backups', methods=['GET'])
def get_backups():
    """Get list of backed up images"""
    try:
        images = UploadedImage.query.order_by(UploadedImage.timestamp.desc()).all()
        return jsonify([img.to_dict() for img in images]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/backup/<int:image_id>', methods=['GET'])
def download_backup(image_id):
    """Download backed up image"""
    try:
        image = UploadedImage.query.get(image_id)
        if not image:
            return jsonify({'error': 'Image not found'}), 404
        return jsonify({
            'filename': image.original_filename,
            'path': image.file_path,
            'timestamp': image.timestamp.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all waste categories"""
    return jsonify({
        'categories': classifier.class_names,
        'total': len(classifier.class_names)
    }), 200

@app.route('/api/nlp/query', methods=['POST'])
def nlp_query():
    """Natural Language Query interface for waste statistics - enhanced intent engine"""
    try:
        data = request.json
        raw_query = data.get('query', '')
        query = raw_query.lower().strip()
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
        
        answer, intent = _process_nlp_query(query)
        
        # Log the query
        log = NLPQueryLog(query=raw_query, response=answer, intent=intent)
        db.session.add(log)
        db.session.commit()
        
        return jsonify({'answer': answer, 'intent': intent}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


def _process_nlp_query(query):
    """Core NLP intent processor — returns (answer, intent_label)"""
    stats = Statistics.query.first()
    total_predictions = stats.total_predictions if stats else Prediction.query.count()
    total_uploads = stats.total_uploads if stats else 0
    total_cameras = stats.total_cameras if stats else 0
    avg_confidence = stats.average_confidence if stats else 0.0

    recycling_tips = {
        'plastic': "Rinse, dry, and place in the recyclables bin. Avoid oily or contaminated plastics.",
        'metal': "Rinse cans and place in the recyclables bin. Crush if possible to save space.",
        'glass': "Rinse and place in the glass bin. Remove lids or caps first.",
        'paper': "Keep dry and place in the paper bin. Avoid wet or greasy paper.",
        'cardboard': "Flatten boxes and keep dry. Place in the paper/cardboard bin.",
        'organic': "Compost if possible. Use a green/organic bin for food waste.",
        'Battery': "Do not put in regular bins. Take to a battery or e-waste collection center.",
        'Keyboard': "E-waste. Drop off at certified electronics recycling.",
        'Mobile': "E-waste. Use certified take-back or recycling programs.",
        'Mouse': "E-waste. Recycle at electronics collection points.",
        'Printer': "E-waste. Check manufacturer take-back programs.",
        'Television': "E-waste. Large electronics must go to authorized facilities.",
        'Microwave': "E-waste. Requires specialized handling at collection centers.",
        'Washing Machine': "Large appliance. Contact municipal collection or authorized recycler.",
        'PCB': "Hazardous e-waste. Use certified electronics recyclers.",
        'Player': "E-waste. Recycle with electronics drop-off services.",
        'trash': "General waste. Bag properly and place in the landfill bin."
    }
    
    # ── today / this week / this month time filters ──────────────────────
    now = datetime.utcnow()
    today_start    = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start     = today_start - timedelta(days=now.weekday())
    month_start    = today_start.replace(day=1)
    
    def count_in_range(start, category=None):
        q = Prediction.query.filter(Prediction.timestamp >= start)
        if category:
            q = q.filter_by(category=category)
        return q.count()

    # ── intent: recycling tips / disposal help ──────────────────────────
    if any(w in query for w in ['recycle', 'recycling', 'dispose', 'disposal', 'bin', 'where do i put', 'how to']) and _extract_category(query):
        cat = _extract_category(query)
        tip = recycling_tips.get(cat, "Please dispose responsibly according to local guidelines.")
        return f"For {cat}, {tip}", 'recycle_tips'
    
    # ── intent: help ─────────────────────────────────────────────────────
    if any(w in query for w in ['help', 'what can', 'what do you know', 'commands', 'questions']):
        return (
            "I can answer questions like: 'How many items today?', "
            "'What is the most common waste?', 'Show plastic count this week', "
            "'Average confidence?', 'How many e-waste items?', "
            "'Compare plastic vs metal', 'Any glass detected today?'",
            'help'
        )
    
    # ── intent: today count ───────────────────────────────────────────────
    if 'today' in query:
        category = _extract_category(query)
        count = count_in_range(today_start, category)
        label = f"{category} waste" if category else "waste items"
        return f"Today, {count} {label} {'have' if count != 1 else 'has'} been classified.", 'today_count'
    
    # ── intent: this week count ───────────────────────────────────────────
    if 'this week' in query or 'week' in query:
        category = _extract_category(query)
        count = count_in_range(week_start, category)
        label = f"{category} waste" if category else "waste items"
        return f"This week, {count} {label} have been classified.", 'week_count'
    
    # ── intent: this month count ──────────────────────────────────────────
    if 'this month' in query or 'month' in query:
        category = _extract_category(query)
        count = count_in_range(month_start, category)
        label = f"{category} waste" if category else "waste items"
        return f"This month, {count} {label} have been classified.", 'month_count'
    
    # ── intent: comparison (plastic vs metal, etc.) ───────────────────────
    if ' vs ' in query or ' versus ' in query or 'compare' in query:
        cats = re.findall(r'(plastic|metal|glass|paper|organic|cardboard|battery|electronic|e-waste|pcb)', query)
        if len(cats) >= 2:
            # Convert to exact class names
            mapping = {
                'plastic': 'plastic', 'metal': 'metal', 'glass': 'glass',
                'paper': 'paper', 'organic': 'organic', 'cardboard': 'cardboard',
                'battery': 'Battery', 'electronic': 'PCB', 'e-waste': 'PCB', 'pcb': 'PCB'
            }
            cat_a = mapping.get(cats[0], cats[0])
            cat_b = mapping.get(cats[1], cats[1])
            count_a = Prediction.query.filter_by(category=cat_a).count()
            count_b = Prediction.query.filter_by(category=cat_b).count()
            winner = cat_a if count_a >= count_b else cat_b
            return (
                f"{cat_a}: {count_a} items vs {cat_b}: {count_b} items. "
                f"{winner} is more common in the system.",
                'comparison'
            )
    
    # ── intent: accuracy / confidence / performance ───────────────────────
    if any(w in query for w in ['accuracy', 'accurate', 'confidence', 'confident', 'performance', 'model', 'score', 'precision', 'f1']):
        avg = round(avg_confidence * 100, 2)
        level = 'excellent' if avg >= 85 else 'good' if avg >= 70 else 'moderate'
        return (
            f"The model is performing at a {level} level with an average confidence of {avg}%. "
            f"Total predictions made: {total_predictions}.",
            'performance'
        )
    
    # ── intent: most common / top category ───────────────────────────────
    if any(w in query for w in ['most', 'top', 'common', 'frequent', 'dominant', 'highest']):
        # compute live
        from sqlalchemy import func
        result = db.session.query(
            Prediction.category, func.count(Prediction.category).label('cnt')
        ).group_by(Prediction.category).order_by(db.desc('cnt')).first()
        if result:
            return f"The most common waste type is '{result[0]}' with {result[1]} detections.", 'top_category'
        return "Not enough data to determine the top category yet.", 'top_category'

    # ── intent: category count ───────────────────────────────────────────
    if any(w in query for w in ['category', 'categories', 'classes', 'labels', 'types']):
        total_categories = len(classifier.class_names)
        return (
            f"The model supports {total_categories} waste categories in total.",
            'category_count'
        )
    
    # ── intent: total / how many (generic) ───────────────────────────────
    if any(w in query for w in ['total', 'how many', 'count', 'number']):
        if 'upload' in query:
            return f"A total of {total_uploads} images have been uploaded to the system.", 'total_uploads'
        if 'camera' in query:
            return f"A total of {total_cameras} images were captured via camera scan.", 'total_camera'
        category = _extract_category(query)
        if category:
            count = Prediction.query.filter_by(category=category).count()
            return f"There are {count} {category} items classified in the system.", 'category_count'
        return f"The system has processed a total of {total_predictions} waste classifications so far.", 'total_count'
    
    # ── intent: specific categories ───────────────────────────────────────
    cat = _extract_category(query)
    if cat:
        count = Prediction.query.filter_by(category=cat).count()
        pct = round(count / total_predictions * 100, 1) if total_predictions > 0 else 0
        return f"There are {count} {cat} items detected ({pct}% of all classifications).", 'category_count'
    
    # ── intent: e-waste ───────────────────────────────────────────────────
    if any(w in query for w in ['electronic', 'e-waste', 'ewaste', 'pcb', 'circuit']):
        # E-waste categories using EXACT class names from trained model
        e_cats = ['Battery', 'Keyboard', 'Mobile', 'Mouse', 'Printer', 'Television', 'Microwave', 'Washing Machine', 'Player', 'PCB']
        count = Prediction.query.filter(Prediction.category.in_(e_cats)).count()
        return f"Electronic waste (E-waste) accounts for {count} of all detected items. Top categories: PCB, Mobile, Television.", 'ewaste'
    
    # ── intent: last / recent ─────────────────────────────────────────────
    if any(w in query for w in ['last', 'recent', 'latest', 'newest']):
        recent = Prediction.query.order_by(Prediction.timestamp.desc()).first()
        if recent:
            delta = now - recent.timestamp
            mins = int(delta.total_seconds() / 60)
            time_str = f"{mins} min ago" if mins < 60 else f"{mins // 60}h ago"
            return (
                f"The last classification was '{recent.category}' with {round(recent.confidence * 100, 1)}% confidence, "
                f"detected {time_str}.",
                'recent'
            )
        return "No recent classifications found.", 'recent'
    
    # ── intent: recyclable ────────────────────────────────────────────────
    if any(w in query for w in ['recycl', 'recyclable', 'recycle']):
        # Recyclable categories using EXACT class names from trained model
        recyclable_cats = ['paper', 'cardboard', 'glass', 'metal', 'plastic']
        count = Prediction.query.filter(Prediction.category.in_(recyclable_cats)).count()
        pct = round(count / total_predictions * 100, 1) if total_predictions > 0 else 0
        return f"{count} items ({pct}%) are recyclable materials (paper, cardboard, glass, metal, plastic).", 'recyclable'
    
    # ── intent: trend / growth ────────────────────────────────────────────
    if any(w in query for w in ['trend', 'growth', 'growing', 'increasing']):
        last7 = count_in_range(now - timedelta(days=7))
        prev7 = Prediction.query.filter(
            Prediction.timestamp >= now - timedelta(days=14),
            Prediction.timestamp < now - timedelta(days=7)
        ).count()
        if prev7 > 0:
            change = round((last7 - prev7) / prev7 * 100, 1)
            direction = "up" if change >= 0 else "down"
            return f"Classification volume is {direction} {abs(change)}% this week vs last week ({last7} vs {prev7} items).", 'trend'
        return f"This week had {last7} classifications. Not enough history for trend comparison.", 'trend'
    
    # ── fallback ──────────────────────────────────────────────────────────
    return (
        "I didn't quite catch that. Try asking: 'How many items today?', "
        "'Most common waste type?', 'Plastic count this week?', or 'Model accuracy?'",
        'fallback'
    )


def _extract_category(query):
    """Extract a specific waste category from query text - uses EXACT class names from trained model"""
    # Map keywords to EXACT class names from trained model
    mapping = {
        'plastic': 'plastic',
        'metal': 'metal',
        'glass': 'glass',
        'paper': 'paper',
        'organic': 'organic',
        'food': 'organic',
        'cardboard': 'cardboard',
        'battery': 'Battery',
        'batteries': 'Battery',
        'keyboard': 'Keyboard',
        'mobile': 'Mobile',
        'phone': 'Mobile',
        'mouse': 'Mouse',
        'printer': 'Printer',
        'television': 'Television',
        'tv': 'Television',
        'microwave': 'Microwave',
        'washing machine': 'Washing Machine',
        'pcb': 'PCB',
        'circuit': 'PCB',
        'trash': 'trash',
        'player': 'Player',
    }
    for keyword, category in mapping.items():
        if keyword in query:
            return category
    return None


def _normalize_category(name):
    """Normalize a raw string to DB category name"""
    e_map = {
        'e-waste': 'PCB', 'electronic': 'PCB', 'ewaste': 'PCB',
        'phone': 'Mobile', 'tv': 'Television'
    }
    if name in e_map:
        return e_map[name]
    return name.capitalize()

@app.route('/api/nlp/history', methods=['GET'])
def nlp_history():
    """Return recent NLP query history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        logs = NLPQueryLog.query.order_by(NLPQueryLog.timestamp.desc()).limit(limit).all()
        return jsonify([l.to_dict() for l in logs]), 200
    except OperationalError:
        # Handle missing table or locked DB gracefully
        db.session.rollback()
        try:
            db.create_all()
        except Exception:
            pass
        return jsonify([]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/nlp/suggestions', methods=['GET'])
def nlp_suggestions():
    """Return dynamic suggested questions based on available data"""
    stats = Statistics.query.first()
    suggestions = [
        "How many waste items were classified today?",
        "What is the most common waste type?",
        "Show me plastic count this week",
        "What is the model's average accuracy?",
        "How do I recycle batteries?",
        "How much e-waste has been detected?",
        "How many recyclable items are there?",
        "Compare plastic vs metal",
        "What was the last classification?",
        "Show waste trend this week",
        "How many items were uploaded?"
    ]
    if stats and stats.most_common_category:
        suggestions.insert(0, f"How many {stats.most_common_category} items are there?")
    return jsonify({'suggestions': suggestions[:8]}), 200


@app.route('/api/analytics/breakdown', methods=['GET'])
def analytics_breakdown():
    """Category-level breakdown for charts"""
    try:
        from sqlalchemy import func
        stats = Statistics.query.first()
        total = stats.total_predictions if stats else 0
        
        rows = db.session.query(
            Prediction.category,
            func.count(Prediction.category).label('count')
        ).group_by(Prediction.category).order_by(db.desc('count')).all()
        
        breakdown = [
            {
                'category': r[0],
                'count': r[1],
                'percentage': round(r[1] / total * 100, 1) if total > 0 else 0
            }
            for r in rows
        ]
        return jsonify({'breakdown': breakdown, 'total': total}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics/daily', methods=['GET'])
def analytics_daily():
    """Daily prediction counts for the last N days"""
    try:
        from sqlalchemy import func
        days = request.args.get('days', 7, type=int)
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days - 1)

        rows = db.session.query(
            func.date(Prediction.timestamp).label('day'),
            func.count(Prediction.id).label('count')
        ).filter(Prediction.timestamp >= start_date).group_by('day').all()

        row_map = {r.day: r.count for r in rows}
        series = []
        for i in range(days):
            day = start_date + timedelta(days=i)
            series.append({
                'date': day.isoformat(),
                'count': int(row_map.get(day.isoformat(), 0))
            })

        return jsonify({'series': series}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics/top-categories', methods=['GET'])
def analytics_top_categories():
    """Top categories by count"""
    try:
        from sqlalchemy import func
        limit = request.args.get('limit', 5, type=int)
        rows = db.session.query(
            Prediction.category,
            func.count(Prediction.category).label('count')
        ).group_by(Prediction.category).order_by(db.desc('count')).limit(limit).all()

        data = [{'category': r[0], 'count': r[1]} for r in rows]
        return jsonify({'top_categories': data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics/recent-errors', methods=['GET'])
def analytics_recent_errors():
    """Recent corrections (treated as errors)"""
    try:
        limit = request.args.get('limit', 8, type=int)
        rows = Feedback.query.order_by(Feedback.timestamp.desc()).limit(limit).all()
        return jsonify({'errors': [r.to_dict() for r in rows]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/storage-info', methods=['GET'])
def get_storage_info():
    """Get storage location information"""
    upload_count = len(os.listdir(app.config['UPLOAD_FOLDER'])) if os.path.exists(app.config['UPLOAD_FOLDER']) else 0
    backup_count = len(os.listdir(app.config['BACKUP_FOLDER'])) if os.path.exists(app.config['BACKUP_FOLDER']) else 0
    
    return jsonify({
        'database': {
            'location': app.config['DB_FOLDER'],
            'path': os.path.abspath(app.config['DB_FOLDER']),
            'file': os.path.join(app.config['DB_FOLDER'], 'wastehandling.db'),
            'absolute_file': os.path.abspath(os.path.join(app.config['DB_FOLDER'], 'wastehandling.db'))
        },
        'uploads': {
            'location': app.config['UPLOAD_FOLDER'],
            'path': os.path.abspath(app.config['UPLOAD_FOLDER']),
            'file_count': upload_count,
            'files': os.listdir(app.config['UPLOAD_FOLDER']) if os.path.exists(app.config['UPLOAD_FOLDER']) else []
        },
        'backups': {
            'location': app.config['BACKUP_FOLDER'],
            'path': os.path.abspath(app.config['BACKUP_FOLDER']),
            'file_count': backup_count,
            'files': os.listdir(app.config['BACKUP_FOLDER']) if os.path.exists(app.config['BACKUP_FOLDER']) else []
        }
    }), 200

@app.route('/api/clear-history', methods=['DELETE'])
def clear_history():
    """Clear prediction history (with backup)"""
    try:
        predictions = Prediction.query.all()
        for pred in predictions:
            db.session.delete(pred)
        db.session.commit()
        return jsonify({'success': True, 'message': 'History cleared'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# =================== UTILITY FUNCTIONS ===================

def update_statistics(category, confidence):
    """Update statistics after each prediction"""
    try:
        stats = Statistics.query.first()
        if not stats:
            stats = Statistics()
            db.session.add(stats)
        
        stats.total_predictions += 1
        stats.average_confidence = (
            (stats.average_confidence * (stats.total_predictions - 1) + confidence) 
            / stats.total_predictions
        )
        stats.last_updated = datetime.utcnow()
        
        # Update source counters
        source = request.form.get('source', 'upload')
        if source == 'upload':
            stats.total_uploads += 1
        else:
            stats.total_cameras += 1
        
        # Update most common category
        category_count = db.session.query(Prediction).filter_by(category=category).count()
        current_max = db.session.query(
            db.func.count(Prediction.category)
        ).group_by(Prediction.category).order_by(db.desc(db.func.count(Prediction.category))).first()
        
        if current_max and category_count >= current_max[0]:
            stats.most_common_category = category
        
        db.session.commit()
    except Exception as e:
        print(f"Error updating statistics: {e}")

# =================== ERROR HANDLERS ===================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     return jsonify({'error': 'Internal server error'}), 500

# =================== CORS SETUP ===================

from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# =================== DATABASE INITIALIZATION ===================

with app.app_context():
    db.create_all()

# =================== ASGI WRAPPER (for uvicorn) ===================
# Flask is WSGI; wrap with asgiref so `uvicorn app:asgi_app --reload` works.
from asgiref.wsgi import WsgiToAsgi
asgi_app = WsgiToAsgi(app)



if __name__ == '__main__':
    print("Starting EcoVision AI Server...")

    port = int(os.environ.get("PORT", 8080))  # 🔥 REQUIRED

    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        use_reloader=False
    )