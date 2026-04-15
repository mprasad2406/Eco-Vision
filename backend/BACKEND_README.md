# EcoVision AI - Backend Setup & Startup Guide

## ✅ Project Structure

```
backend/
├── app.py                          # Main Flask application (WSGI)
├── config.py                       # Configuration settings
├── create_model.py                 # ML model creation script
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── models/                        # ML models directory
│   └── waste_classifier_model.h5  # Pre-trained model (11 MB)
└── data/                          # Data directories
    ├── database/
    │   └── wastehandling.db      # SQLite database
    ├── uploads/                  # User-uploaded images
    └── backups/                  # Image backups
```

## ⚡ Important: WSGI vs ASGI

**EcoVision AI uses Flask (WSGI), NOT Django/ASGI**

❌ **WRONG:**
```bash
uvicorn app:app --reload
```

✅ **CORRECT:**
```bash
python app.py
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Create ML Model (First Time Only)
```bash
python create_model.py
```
Output:
```
✓ Model created: models/waste_classifier_model.h5
✓ Input shape: (224, 224, 3)
✓ Output classes: 17
✓ Classes: ['Battery', 'Cardboard', 'Glass', ...]
```

### 3. Start the Backend Server
```bash
python app.py
```

Expected Output:
```
======================================================================
  🌿 EcoVision AI Backend - Started
======================================================================

📁 Data Locations:
   📦 Database:  D:\Wastemanagement\backend\data\database\wastehandling.db
   📄 Uploads:   D:\Wastemanagement\backend\data\uploads
   💾 Backups:   D:\Wastemanagement\backend\data\backups

🤖 Model Status: ✅ Loaded Successfully

🌐 API Server:
   Base URL:   http://localhost:5000
   API Base:   http://localhost:5000/api
   Health:     http://localhost:5000/api/health

💡 Startup Command: python app.py
   ⚠️  NOT: uvicorn (Flask uses WSGI, not ASGI)
======================================================================
```

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Response: Server status, timestamp, data locations

### Make Prediction
```
POST /api/predict
Content-Type: multipart/form-data

Parameters:
  - image: Image file (JPG, PNG, WebP)
  - source: 'upload' or 'camera' (optional)
```

### Get Prediction History
```
GET /api/history?limit=20
```

### Get Statistics
```
GET /api/statistics
```

### Get All Categories
```
GET /api/categories
```

### Get Storage Info
```
GET /api/storage-info
```

### Clear History
```
DELETE /api/clear-history
```

---

## 🗄️ Database Schema

### Prediction Table
- `id`: Unique identifier
- `timestamp`: When prediction was made
- `category`: Predicted waste category
- `confidence`: Confidence score (0-1)
- `image_path`: Path to image file
- `upload_source`: 'upload' or 'camera'
- `top_predictions`: JSON with top 3 predictions

### UploadedImage Table
- `id`: Unique identifier
- `timestamp`: Upload time
- `filename`: System filename
- `original_filename`: Original filename
- `file_path`: Full path to image
- `source_type`: 'upload' or 'camera'
- `file_size`: File size in bytes

### Statistics Table
- `total_predictions`: Total predictions made
- `total_uploads`: Images uploaded
- `total_cameras`: Camera captures
- `average_confidence`: Mean confidence score
- `most_common_category`: Most predicted category
- `last_updated`: Last update timestamp

---

## 🎯 Waste Categories (17 Classes)

**Recyclable:**
- Plastic, Metal, Glass, Paper, Cardboard

**Organic:**
- Organic (compost)

**Electronics (E-Waste):**
- Keyboard, Mobile, Mouse, Printer, Television, Microwave, Washing Machine, PCB, Player

**Other:**
- Battery, Trash

---

## 🐛 Troubleshooting

### Error: "Model not found"
**Solution:** Run `python create_model.py` first

### Error: "Port 5000 already in use"
**Solution:** Kill the process or change port in `app.py`:
```python
app.run(port=8000)  # Use different port
```

### Error: "ASGI app" / "Invocation string"
**Solution:** Use Flask command, NOT Uvicorn:
```bash
python app.py  # ✅ CORRECT
# NOT: uvicorn app:app  ❌ WRONG
```

### Database Not Found
**Solution:** Database auto-creates on first run
```bash
# Check location:
http://localhost:5000/api/storage-info
```

---

## 📦 Dependencies

- **Flask** 3.0.0 - Web framework
- **Flask-CORS** 4.0.0 - Cross-origin requests
- **Flask-SQLAlchemy** 3.1.1 - Database ORM
- **TensorFlow** 2.21.0 - ML framework
- **Pillow** 10.1.0 - Image processing
- **OpenCV** 4.8.1.78 - Computer vision

---

## 📝 Environment Variables (.env)

```
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
DATABASE_URL=sqlite:///data/database/wastehandling.db
```

---

## 🔗 Frontend Integration

Frontend runs on: `http://localhost:5173` (Vite)

Backend API: `http://localhost:5000/api`

CORS enabled for localhost:3000 and localhost:5173

---

## ✨ Features

✅ Real-time waste classification
✅ Upload images or use camera
✅ Prediction history tracking
✅ Database persistence
✅ Image backup system
✅ Statistics & analytics
✅ REST API with CORS
✅ Mock predictions without model (for testing)

---

**Version:** 1.0.0
**Last Updated:** April 2026
**Status:** Production Ready ✅
