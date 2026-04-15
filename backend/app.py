"""
EcoVision AI Backend - Flask Server
Main application file with SQLite database integration
"""

# Suppress TensorFlow warnings
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import warnings
warnings.filterwarnings('ignore')

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from datetime import datetime
import numpy as np
from PIL import Image
import tensorflow as tf
import json
from pathlib import Path

# Suppress TensorFlow verbosity
tf.get_logger().setLevel('ERROR')

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

# =================== TRASH DETECTION MODEL ===================

class WasteClassifier:
    """Load and manage the waste classification model"""
    
    def __init__(self):
        self.model = None
        self.class_names = [
            'Battery', 'Cardboard', 'Glass', 'Metal', 'Organic',
            'Paper', 'Plastic', 'Trash', 'Keyboard', 'Mobile',
            'Mouse', 'Printer', 'Television', 'Microwave', 'Washing Machine',
            'PCB', 'Player'
        ]
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model (can be replaced with actual model path)"""
        try:
            model_path = 'models/waste_classifier_model.h5'
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                print(f"✓ Model loaded from: {model_path}")
            else:
                print(f"⚠️  Model not found at {model_path}")
                print(f"✓ Using MOCK PREDICTIONS (place trained model in models/ folder)")
                self.model = None
        except Exception as e:
            print(f"⚠️  Error loading model: {e}")
            print(f"✓ Using MOCK PREDICTIONS instead")
            self.model = None
    
    def predict(self, image_path):
        """Make prediction on waste image"""
        try:
            # Load and process image
            img = Image.open(image_path).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img) / 255.0
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
        'database_location': app.config['DB_FOLDER'],
        'uploads_location': app.config['UPLOAD_FOLDER'],
        'backups_location': app.config['BACKUP_FOLDER']
    }), 200

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
        
        return jsonify({
            'success': True,
            'prediction': prediction_result['primary_class'],
            'confidence': round(prediction_result['confidence'] * 100, 2),
            'top_predictions': prediction_result['top_predictions'],
            'image_id': uploaded_image.id
        }), 200
        
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
    """Natural Language Query interface for waste statistics"""
    try:
        data = request.json
        query = data.get('query', '').lower()
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
            
        stats = Statistics.query.first()
        if not stats:
            return jsonify({'answer': "No statistics are available yet. Try classifying some waste first!"}), 200

        # Simple keyword-based NLP logic
        if 'total' in query or 'how many' in query:
            if 'upload' in query:
                return jsonify({'answer': f"A total of {stats.total_uploads} images have been explicitly uploaded."}), 200
            if 'camera' in query:
                return jsonify({'answer': f"A total of {stats.total_cameras} images were captured via camera."}), 200
            return jsonify({'answer': f"The system has processed a total of {stats.total_predictions} waste items so far."}), 200
            
        if 'accuracy' in query or 'performance' in query or 'confident' in query:
            return jsonify({'answer': f"The model is performing well with an average confidence score of {round(stats.average_confidence * 100, 2)}%."}), 200
            
        if 'most' in query or 'common' in query or 'frequent' in query:
            category = stats.most_common_category if stats.most_common_category else "not determined yet"
            return jsonify({'answer': f"The most frequently detected waste category is '{category}'."}), 200
            
        if 'plastic' in query:
            count = Prediction.query.filter_by(category='Plastic').count()
            return jsonify({'answer': f"I've found {count} plastic items in the current records."}), 200
            
        if 'metal' in query:
            count = Prediction.query.filter_by(category='Metal').count()
            return jsonify({'answer': f"There are {count} metal items classified so far."}), 200

        if 'organic' in query or 'food' in query:
            count = Prediction.query.filter_by(category='Organic').count()
            return jsonify({'answer': f"There are {count} organic waste entries in the database."}), 200

        if 'electronic' in query or 'e-waste' in query or 'pcb' in query:
            count = Prediction.query.filter(Prediction.category.in_(['PCB', 'Keyboard', 'Mobile', 'Mouse', 'Printer', 'Television'])).count()
            return jsonify({'answer': f"Electronic waste (E-waste) accounts for {count} of our detected items."}), 200

        return jsonify({
            'answer': "I'm not sure about that specific detail. You can ask about 'total waste', 'accuracy', 'most common waste', or specific types like 'plastic' or 'e-waste'."
        }), 200
        
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

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# =================== CORS SETUP ===================

from flask_cors import CORS
CORS(app)

# =================== DATABASE INITIALIZATION ===================

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    print("✅ Starting EcoVision AI Flask Server...")
    print("   Visit: http://localhost:5000")
    print("   Press Ctrl+C to stop\n")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=True)
