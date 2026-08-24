# 🚀 NexHire Complete Deployment Guide (Render + Vercel)

This guide walks you step-by-step through deploying the **NexHire** full-stack platform:
- **Backend API (Node.js/Express)** ➔ Deployed on **Render** (or Railway / Koyeb)
- **Frontend App (React + Vite + Tailwind)** ➔ Deployed on **Vercel**
- **Database** ➔ MongoDB Atlas

---

## 📋 Prerequisites
Before deploying, make sure you have:
1. A **GitHub** account with this repository pushed.
2. A free **MongoDB Atlas** database cluster (or local MongoDB string).
3. A free account on **Render** (`https://render.com`) and **Vercel** (`https://vercel.com`).

---

## 🗄️ Step 1: Set Up MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user (e.g. `nexhire_admin`) with a strong password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```text
   mongodb+srv://nexhire_admin:<password>@cluster0.xxx.mongodb.net/nexhire?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 2: Deploy Backend to Render

1. Log into your **Render Dashboard** (`https://dashboard.render.com`).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Fill in the deployment details:
   - **Name**: `nexhire-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`

5. Scroll down to **Environment Variables** and add the following keys:
   | Key | Value Example |
   |---|---|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://admin:pass@cluster0.xxx.mongodb.net/nexhire?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your_random_secret_jwt_key_here` |
   | `CLIENT_URL` | `https://your-nexhire-app.vercel.app` *(Your Vercel URL)* |

6. Click **Create Web Service**. Render will build and launch your backend service!
   - Note your Render Backend URL (e.g. `https://nexhire-backend.onrender.com`).

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Log into your **Vercel Dashboard** (`https://vercel.com`).
2. Click **Add New...** ➔ **Project**.
3. Import your **NexHire** GitHub repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Open **Environment Variables** and add:
   | Key | Value Example |
   |---|---|
   | `VITE_API_URL` | `https://nexhire-backend.onrender.com` |

6. Click **Deploy**. Vercel will build and publish your frontend application!

---

## 🔄 Step 4: Final Verification & CORS Sync

1. Copy your deployed **Vercel Frontend URL** (e.g. `https://nexhire.vercel.app`).
2. Go back to your **Render Web Service** ➔ **Environment Variables**.
3. Set `CLIENT_URL` = `https://nexhire.vercel.app` (your actual Vercel domain).
4. Save Changes on Render to trigger a zero-downtime redeploy.

---

## 🧪 Post-Deployment Checklist
- ✅ Open your Vercel URL and browse open jobs.
- ✅ Register a test candidate account.
- ✅ Upload a PDF or Word DOCX resume.
- ✅ Log in as a recruiter, post a job opening, and download candidate resumes!

---
*Created for NexHire Production Deployment.*
