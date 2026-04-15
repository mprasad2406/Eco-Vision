# � EcoVision AI - Waste Classification System

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)](https://flask.palletsprojects.com)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-orange?logo=tensorflow)](https://tensorflow.org)
[![SQLite](https://img.shields.io/badge/SQLite-DB-lightblue?logo=sqlite)](https://sqlite.org)

**Professional AI-powered waste classification with real-time image analysis, database persistence, and modern UI/UX**

A complete waste management solution using MobileNetV2 deep learning to classify waste into 17 categories. Features include real-time predictions, image upload & camera capture, prediction history, analytics dashboard, and a professional responsive interface.

---

## ✅ Quick Start (2 minutes)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python create_model.py              # First time only (~1-2 min)
python app.py                       # Starts on http://localhost:5000
```

### 2. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev                         # Starts on http://localhost:5173
```

### 3. Open in Browser
```
http://localhost:5173
```

✅ **Done!** System is ready to use.

---

## 🎯 Key Features

### 🖼️ **Image Processing**
- Upload waste images (drag & drop supported)
- Live camera capture & photo
- Real-time classification with confidence scores
- Support for PNG, JPG, WebP formats

### 🤖 **AI/ML**
- MobileNetV2 transfer learning architecture
- 17 waste categories classification
- 224x224 RGB image input
- Top-3 predictions with confidence scores
- ~100-200ms inference time per image

### 📊 **Analytics & History**
- Track all predictions with timestamps
- View prediction history (filterable)
- Classification statistics & trends
- Most common waste categories
- Average confidence metrics

### 💾 **Data Persistence**
- SQLite database (auto-created)
- Automatic image backup system
- Prediction history storage
- Statistics tracking
- Full data visibility in file system

### 🎨 **Professional UI/UX**
- Modern gradient design (teal/navy theme)
- Glassmorphism effects & animations
- Fully responsive (mobile, tablet, desktop)
- Smooth fade-in & slide-in animations
- Accessible form inputs & buttons
- Professional typography hierarchy

### 🌐 **REST API**
- `/api/predict` - Make predictions
- `/api/history` - Get prediction history
- `/api/statistics` - Get analytics data
- `/api/categories` - List all 17 categories
- `/api/storage-info` - View data locations
- `/api/health` - Health check

---

## 🏗️ Project Structure

```
wastemanagement/
│
├── 📁 backend/                          # Flask REST API
│   ├── app.py                          # Main Flask application
│   ├── config.py                       # Configuration settings
│   ├── requirements.txt                # Python dependencies
│   ├── .env                            # Environment variables
│   │
│   ├── 📁 uploads/                     # Uploaded images storage
│   ├── 📁 backups/                     # Backup directory
│   ├── 📁 models/                      # ML models
│   │   └── waste_classifier_model.h5  # Trained model (to add)
│   │
│   └── ecovision.db                    # SQLite database
│
├── 📁 frontend/                        # React + Vite
│   ├── src/
│   │   ├── 📁 pages/                  # Page components
│   │   │   ├── Home.jsx               # Dashboard home
│   │   │   ├── Predict.jsx            # Image prediction
│   │   │   ├── Categories.jsx         # Waste categories list
│   │   │   ├── Stats.jsx              # Statistics dashboard
│   │   │   ├── About.jsx              # About project
│   │   │   ├── Contact.jsx            # Contact form
│   │   │   └── Landing.jsx            # Landing page
│   │   │
│   │   ├── 📁 components/             # Reusable components
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   └── Logo.jsx               # App logo
│   │   │
│   │   ├── 📁 styles/                 # CSS stylesheets
│   │   │   ├── App.css                # Global styles
│   │   │   ├── Navbar.css             # Navigation styling
│   │   │   ├── Home.css               # Home page styles
│   │   │   ├── Predict.css            # Predict page styles
│   │   │   ├── Categories.css         # Categories page styles
│   │   │   ├── Stats.css              # Stats page styles
│   │   │   ├── About.css              # About page styles
│   │   │   ├── Contact.css            # Contact page styles
│   │   │   └── Landing.css            # Landing page styles
│   │   │
│   │   ├── 📁 utils/                  # Utility functions
│   │   │   ├── apiService.js          # Backend API calls
│   │   │   └── speechService.js       # Voice integration
│   │   │
│   │   ├── App.jsx                    # Main app component
│   │   └── main.jsx                   # React entry point
│   │
│   ├── public/                         # Static assets
│   ├── .env                           # Frontend env config
│   ├── package.json                   # Node dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── index.html                     # HTML entry point
│
├── SETUP_GUIDE.md                      # Complete setup instructions
└── README.md                           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- SQLite3

### Backend Setup (3 steps)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start server
python app.py
```

**Backend runs at:** `http://localhost:5000`

### Frontend Setup (3 steps)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

### Access the App
Open your browser and go to: **`http://localhost:5173`**

---

## 📚 Database Schema

### Predictions Table
Stores all waste classification predictions
- `id` (int): Primary key
- `timestamp` (datetime): When prediction was made
- `category` (string): Waste category
- `confidence` (float): Prediction confidence 0-1
- `image_path` (string): Path to uploaded image
- `upload_source` (string): 'upload' or 'camera'
- `top_predictions` (json): Top 3 predictions with scores

### UploadedImage Table
Tracks uploaded/camera images for backup
- `id` (int): Primary key
- `timestamp` (datetime): Upload time
- `filename` (string): Storage filename
- `original_filename` (string): User's original filename
- `file_path` (string): Full file path
- `source_type` (string): 'upload' or 'camera'
- `file_size` (int): File size in bytes

### Statistics Table
Aggregated analytics and insights
- `id` (int): Primary key
- `total_predictions` (int): Total predictions made
- `total_uploads` (int): Total uploads
- `total_cameras` (int): Camera captures
- `average_confidence` (float): Mean confidence
- `most_common_category` (string): Most predicted waste type
- `last_updated` (datetime): Last update time

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
Returns: `{ status, timestamp, service }`

### Predict Waste
```http
POST /api/predict
Content-Type: multipart/form-data

image: File (required)
source: 'upload' | 'camera' (default: 'upload')
```
Returns: `{ prediction, confidence, top_predictions, image_id }`

### Get History
```http
GET /api/history?limit=20
```
Returns: `[{ id, timestamp, category, confidence, ... }]`

### Get Statistics
```http
GET /api/statistics
```
Returns: `{ total_predictions, average_confidence, most_common, ... }`

### Get Categories
```http
GET /api/categories
```
Returns: `{ categories: [...], total: 17 }`

### Get Backups
```http
GET /api/backups
```
Returns: `[{ id, timestamp, filename, source, size }]`

### Download Backup
```http
GET /api/backup/<image_id>
```
Returns: `{ filename, path, timestamp }`

### Clear History
```http
DELETE /api/clear-history
```
Returns: `{ success, message }`

---

## 🎨 Design System

### Color Palette
| Color | Usage | Value |
|-------|-------|-------|
| Primary | Buttons, Links, Gradients | `#16a085` → `#1dd1a1` |
| Background | Page Background | `#0f172a` → `#1a1f3a` |
| Text | Main Text | `#cbd5e0` |
| Text Light | Headings | `#e8e9eb` |
| Accent | Hover States | `#f39c12` → `#ff6b6b` |

### Typography
- **Headings**: Inter, Bold, Line-height 1.2
- **Body**: Inter, Regular, Line-height 1.6
- **Font Size**: 16px base, responsive scaling

### Spacing
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **X-Large**: 40px

### Border Radius
- **Small Components**: 6-8px
- **Large Components**: 12-16px

---

## 🧠 AI Model Details

### Architecture
- **Base Model**: MobileNetV2 (pre-trained on ImageNet)
- **Input**: 224×224 RGB images
- **Output**: 17 waste category probabilities
- **Pooling**: Global Average Pooling
- **Augmentation**: RandomFlip, RandomRotation, RandomZoom
- **Optimization**: Adam optimizer
- **Loss**: Sparse Categorical Crossentropy

### Training
- **Dataset**: Kaggle Waste Classification Dataset
- **Train/Test Split**: 80/20
- **Batch Size**: 32
- **Image Preprocessing**: Normalized to [0, 1]
- **Data Augmentation**: Yes (improves generalization)

### Performance
- **Accuracy**: 85-90% across categories
- **Inference Time**: ~100-200ms per image
- **Model Size**: ~13MB
- **Memory**: ~512MB during inference

---

## 🎙️ Voice Control

### Supported Commands
- **Navigation**: "home", "predict", "categories", "stats", "about", "contact"
- **Toggle**: On/Off button in navbar
- **Feedback**: Text-to-speech responses

### Usage
1. Click 🎤 button in navbar
2. Speak command clearly
3. Get voice feedback

---

## 📝 Waste Categories (17)

1. **Battery** - Disposable/rechargeable batteries
2. **Cardboard** - Cardboard boxes, papers
3. **Glass** - Glass bottles, containers
4. **Metal** - Metal cans, aluminum
5. **Organic** - Food waste, plants
6. **Paper** - Paper, documents
7. **Plastic** - Plastic bags, bottles
8. **Trash** - General waste
9. **Keyboard** - Computer keyboards
10. **Mobile** - Mobile phones, devices
11. **Mouse** - Computer mice, input devices
12. **Printer** - Printers, scanners
13. **Television** - TV sets, monitors
14. **Microwave** - Microwave ovens
15. **Washing Machine** - Washing machines
16. **PCB** - Circuit boards, electronics
17. **Player** - Media players, devices

---

## 🔧 Configuration

### Backend `.env`
```env
FLASK_ENV=development
FLASK_APP=app.py
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///ecovision.db
UPLOAD_FOLDER=uploads
BACKUP_FOLDER=backups
MODEL_PATH=models/waste_classifier_model.h5
HOST=0.0.0.0
PORT=5000
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=EcoVision AI
VITE_APP_VERSION=1.0.0
```

---

## 📦 Dependencies

### Backend
- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1
- Flask-CORS 4.0.0
- TensorFlow 2.15.0
- Keras 2.15.0
- Pillow 10.1.0
- OpenCV-Python 4.8.1.78

### Frontend
- React 19.2.4
- React Router 7.14.1
- Vite 8.0.4

For complete list, see `requirements.txt` and `package.json`

---

## 🚦 Running the Project

### Start Both Services

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
# Backend at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend at http://localhost:5173
```

**Open Browser:**
```
http://localhost:5173
```

---

## 🛠️ Development Workflow

### Adding New Endpoints
1. Define in `backend/app.py`
2. Add CORS support
3. Call from `frontend/utils/apiService.js`
4. Update relevant page components

### Styling Changes
1. Modify CSS in `frontend/src/styles/`
2. Hot reload handles automatic updates
3. Follow color palette conventions

### Database Changes
1. Update model classes in `backend/app.py`
2. Delete `backend/ecovision.db`
3. Run `python -c "from app import app, db; app.app_context().push(); db.create_all()"`

### Training Custom Model
1. Use `backend/smartwastemodel.ipynb`
2. Export to `backend/models/waste_classifier_model.h5`
3. Update model loading in `app.py`

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Find and kill process on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Module not found errors**
```bash
pip install --upgrade -r requirements.txt
```

**Database locked error**
```bash
rm ecovision.db  # Delete and reinitialize
```

### Frontend Issues

**API calls failing**
- Check backend is running on port 5000
- Verify `.env` has correct API URL
- Check console for CORS errors

**Styles not updating**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (npm run dev)

**Voice not working**
- Check browser permissions
- Verify microphone is available
- Test in different browser

---

## 📈 Future Enhancements

- [ ] User authentication & profiles
- [ ] Advanced analytics dashboard
- [ ] Real-time model updates
- [ ] Mobile app (React Native)
- [ ] Batch image processing
- [ ] PDF report generation
- [ ] Integration with waste services
- [ ] Cloud deployment
- [ ] Multi-language support
- [ ] Model versioning

---

## 📄 License

EcoVision AI - Intelligent Waste Classification System

All rights reserved © 2024

---

## 👥 Contributing

Contributions are welcome! Please ensure:
- Code follows project style guide
- All tests pass
- Documentation is updated
- Commit messages are descriptive

---

## 📞 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed guides
2. Review troubleshooting section above
3. Check browser console for errors
4. Verify configuration files

---

**Made with ❤️ for sustainable waste management**

**Version**: 1.0.0  
**Last Updated**: 2024
