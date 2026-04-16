# 🚀 Deployment Guide - EcoVision AI

## Problem: TensorFlow Too Large for Vercel

**Why it failed:** TensorFlow + other ML dependencies = **~2.3GB**, exceeding Vercel's **500MB Lambda limit**.

**Solution:** Deploy frontend and backend **separately**.

---

## ✅ Solution: Separate Deployment Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (React + Vite)               │
│   Deployed on: Vercel                   │
│   URL: ecovision.vercel.app             │
└──────────────────┬──────────────────────┘
                   │ API calls to
                   ↓
┌─────────────────────────────────────────┐
│   Backend (Flask + TensorFlow)          │
│   Deployed on: Render/Railway/Heroku    │
│   URL: ecovision-api.onrender.com       │
└─────────────────────────────────────────┘
```

---

## 📍 Frontend: Vercel (Already Configured)

### Already Done ✅
- `vercel.json` updated to deploy **only frontend**
- Build command: `npm run build`
- Output: `frontend/dist` (static files)

### Deploy Now
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Set Environment Variable
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL = https://your-backend-url.onrender.com/api
```

---

## 🖥️ Backend: Pick One Service

### ⭐ **Option 1: Render (Recommended)**
Free tier + auto-deploys from GitHub

#### Steps:
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Create **New Web Service**
4. Select repository
5. Settings:
   - **Name**: `ecovision-api`
   - **Environment**: `Python 3.11`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Root Directory**: (leave blank)
6. **Add Environment Variables**:
   ```
   FLASK_ENV=production
   FLASK_APP=backend/app.py
   PORT=10000
   ```
7. Deploy!

**Result:** Backend runs at `https://ecovision-api.onrender.com`

---

### 🟢 **Option 2: Railway**
Simple deployment, generous free tier

#### Steps:
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select this repo
5. Add environment:
   ```
   FLASK_APP=backend/app.py
   FLASK_ENV=production
   ```
6. Click "Deploy"

**Result:** Backend URL in Railway dashboard

---

### 🟣 **Option 3: Heroku (Paid)**
Industry standard, reliable

#### Steps:
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app:
   ```bash
   heroku create ecovision-api
   ```
4. Create `Procfile` in root:
   ```
   web: cd backend && python app.py
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

**Result:** Backend at `https://ecovision-api.herokuapp.com`

---

## 🔧 Update Frontend After Backend Deployment

### 1. Set Vercel Environment Variable
```
VITE_API_BASE_URL = https://ecovision-api.onrender.com/api
```

### 2. Update `.env` locally (testing)
```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api  # Local testing
# or
VITE_API_BASE_URL=https://ecovision-api.onrender.com/api  # Production
```

### 3. Redeploy Frontend
```bash
cd frontend
vercel --prod
```

---

## 🧪 Test Full Stack

### Test Backend Health
```bash
curl https://ecovision-api.onrender.com/api/health
```

Expected:
```json
{
  "status": "healthy",
  "model": {"loaded": true, "class_count": 17}
}
```

### Test Frontend
Open: `https://ecovision.vercel.app`

Try uploading an image → should get predictions from the backend API.

---

## 📊 Deployment Checklist

- [ ] `vercel.json` updated (frontend only)
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Backend health check passes (`/api/health`)
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] Frontend can call backend API
- [ ] Image upload/prediction works end-to-end

---

## 🚨 Troubleshooting

### Frontend shows "Connection Refused"
→ Backend URL is wrong or not running
```bash
# Check backend is running
curl https://your-backend-url.onrender.com/api/health
```

### CORS errors
→ Check `backend/app.py` has `CORS(app)`
```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

### Model not loading
→ Upload `best_model.h5` to `backend/models/`
```bash
git add backend/models/best_model.h5
git commit -m "Add trained model"
git push
```

---

## 💾 Database

**Important:** SQLite database is **local** to each deployment.

For persistent data, migrate to:
- PostgreSQL (free tier on Render)
- MongoDB Atlas (free tier)
- Firebase

Update `backend/app.py`:
```python
# Change from SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://user:pass@db.onrender.com/db'
```

---

## 🎯 Summary

| Component | Service | Free | URL Pattern |
|-----------|---------|------|-------------|
| Frontend | Vercel | ✅ | `*.vercel.app` |
| Backend | Render | ✅ | `*.onrender.com` |
| Database | SQLite (local) | ✅ | `backend/data/database/wastehandling.db` |

**Next Steps:**
1. Choose backend service (Render recommended)
2. Deploy backend
3. Update Vercel `VITE_API_BASE_URL`
4. Deploy frontend
5. Test end-to-end

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Flask Deployment](https://flask.palletsprojects.com/deployment/)
