# 🚀 NexHire — Master Full-Stack Talent Platform Documentation

> **Complete System Specification, Architecture, Setup Guide, & Technical Reference**  
> NexHire is a production-ready, enterprise-grade talent acquisition and career platform built with **Node.js, Express, MongoDB, React, Vite, and Tailwind CSS**.

---

## 📋 Table of Contents
1. [Overview & Key Features](#-overview--key-features)
2. [Technology Stack](#-technology-stack)
3. [Repository Directory Architecture](#-repository-directory-architecture)
4. [How to Setup & Run (Local Development)](#-how-to-setup--run-local-development)
5. [How the Backend Works](#-how-the-backend-works)
   - [Backend Architecture & Request Flow](#backend-architecture--request-flow)
   - [Database Schemas & Data Models](#database-schemas--data-models)
   - [Security & Authentication Subsystem](#security--authentication-subsystem)
   - [Binary Resume Verification Subsystem](#binary-resume-verification-subsystem)
   - [Complete REST API Specification](#complete-rest-api-specification)
6. [How the Frontend Works](#-how-the-frontend-works)
   - [Frontend Architecture & Component Layout](#frontend-architecture--component-layout)
   - [Global State Management (Context API)](#global-state-management-context-api)
   - [API Integration & Axios Interceptors](#api-integration--axios-interceptors)
   - [Design System & Glassmorphism UI](#design-system--glassmorphism-ui)
7. [Automated Testing & QA](#-automated-testing--qa)
8. [Production Deployment Guide (Render + Vercel)](#-production-deployment-guide-render--vercel)

---

## ✨ Overview & Key Features

NexHire bridges the gap between software professionals and recruiters with a streamlined, zero-jargon workflow.

### 👤 Candidate Experience
- **Smart Profile Completion Score**: Real-time completeness meter (0–100%) tracking profile details, experience, skills, and uploaded resume.
- **Binary Resume Upload & Download**: Drag-and-drop file upload supporting PDF and Word (.docx) documents up to 5MB, paired with instant downloading capabilities.
- **One-Click Job Applications**: Instant job discovery with live multi-tag skill filtering and application submission.
- **Application Stage Tracker**: Real-time candidate pipeline state tracking (`Applied` ➔ `Screening` ➔ `Interview` ➔ `Shortlisted` ➔ `Offer` ➔ `Hired` / `Rejected`).

### 💼 Recruiter Experience
- **Job Management Hub**: Create, edit, publish, and toggle active/inactive job openings.
- **Applicant Review Pipeline**: Drawer interface listing all candidate applicants per job posting.
- **Direct Candidate Resume Retrieval**: Download candidate resumes directly from candidate profile cards.
- **Stage Machine Updates**: Recruiter-controlled applicant stage progression.

### 🛡️ Enterprise Security Controls
- **HTTP-Only Cookie Authentication**: JWT tokens stored exclusively in HTTP-Only, SameSite cookies to protect against XSS attacks.
- **Binary Magic-Byte File Validation**: Server-side inspection of raw file headers (`%PDF-` and ZIP header signatures) to block file spoofing and malicious execution.
- **Database Compound Constraints**: Unique index `{ candidateId: 1, jobId: 1 }` enforcing single-application integrity at the MongoDB engine layer.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend UI** | React 18, Vite, Tailwind CSS v4, Lucide Icons, Axios |
| **Backend API** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB Atlas / Local MongoDB Server |
| **Security & Utilities** | JSON Web Tokens (JWT), Cookie-Parser, Bcrypt.js, Helmet, Express-Rate-Limit, Multer |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Deployment** | Vercel (Frontend SPA), Render / Koyeb (Backend Node Service) |

---

## 📁 Repository Directory Architecture

```text
NexHire/
├── backend/                  # Express.js Node Backend API
│   ├── seed/
│   │   └── seedJobs.js       # Pre-seeded starter tech jobs (10 positions)
│   ├── src/
│   │   ├── config/           # Database connection & centralized model registry
│   │   │   ├── db.js
│   │   │   └── models.js
│   │   ├── controllers/      # Controller modules containing core business logic
│   │   │   ├── applicationController.js
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   └── profileController.js
│   │   ├── middleware/       # Express custom middleware
│   │   │   ├── auth.js       # Cookie-based JWT guard
│   │   │   ├── rateLimiter.js# Auth rate limiter
│   │   │   └── upload.js     # Multer file buffer upload memory parser
│   │   ├── models/           # Mongoose Data Schemas
│   │   │   ├── Application.js
│   │   │   ├── CandidateProfile.js
│   │   │   ├── Job.js
│   │   │   ├── Notification.js
│   │   │   ├── StageHistory.js
│   │   │   └── User.js
│   │   ├── routes/           # Express REST API Routers
│   │   │   ├── applicationRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   └── profileRoutes.js
│   │   ├── utils/            # Utility helpers (Binary validation & JWT helpers)
│   │   │   ├── fileValidator.js
│   │   │   └── jwt.js
│   │   ├── app.js            # Express application initialization & middleware setup
│   │   └── server.js         # HTTP Server entry point
│   ├── tests/                # Automated Jest Integration Test Suite
│   │   └── integration/      # Auth, Job, Profile, Resume, and Application tests
│   ├── .env.example          # Environment variables template
│   ├── Dockerfile            # Container configuration
│   ├── jest.config.js        # Jest runner config
│   └── package.json
│
├── frontend/                 # React 18 + Vite SPA Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios instance configured with withCredentials: true
│   │   ├── components/       # Component ecosystem
│   │   │   ├── common/       # Navbar, Footer, Modal, Badges
│   │   │   ├── jobs/         # JobCard, JobFilter, JobDetailModal, PostJobModal
│   │   │   ├── profile/      # ProfileMeter, ProfileEditModal, ResumeUpload
│   │   │   └── recruiter/    # ApplicantCard, JobApplicationsModal
│   │   ├── context/          # React Context (AuthContext & ToastContext)
│   │   ├── pages/            # Home, BrowseJobs, Dashboard, Login, NotFound
│   │   ├── App.jsx           # Router definitions & ProtectedRoute guards
│   │   ├── index.css         # Tailwind imports, glassmorphism tokens, custom animations
│   │   └── main.jsx          # Entry point
│   ├── .env.example          # Frontend env template
│   ├── vercel.json           # Vercel deployment routes config
│   ├── vite.config.js        # Vite dev server proxy config
│   └── package.json
│
└── README.md                 # Master Project Documentation
```

---

## ⚡ How to Setup & Run (Local Development)

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB** running locally (`mongodb://localhost:27017/nexhire`) OR a **MongoDB Atlas** connection string.

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment Configuration File (`.env`)**:
   Copy `.env.example` to `.env` or create `.env` with the following variables:
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/nexhire
   JWT_SECRET=nexhire_super_secret_jwt_key_2026
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Seed Database with Sample Jobs** *(Optional)*:
   ```bash
   node seed/seedJobs.js
   ```

5. **Start Development Backend Server**:
   ```bash
   npm run dev
   ```
   The backend API will start at `http://localhost:5000`. You can check server health at `http://localhost:5000/api/health`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment Configuration File (`.env`)**:
   Copy `.env.example` to `.env`:
   ```ini
   VITE_API_URL=http://localhost:5000
   ```

4. **Start Vite Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ How the Backend Works

### Backend Architecture & Request Flow

The backend follows a standard layered architecture:

```text
[ Client Request ]
       │
       ▼
 [ Security Layer ]  ──────► Helmet, CORS (Credentials Allowed), RateLimiter, CookieParser
       │
       ▼
 [ Routing Layer ]   ──────► Express Routers (/api/auth, /api/profile, /api/jobs, /api/applications)
       │
       ▼
 [ Auth Middleware ] ──────► Extract req.cookies.token ➔ JWT Verify ➔ Attach req.user
       │
       ▼
 [ Controller Layer] ──────► Business Logic, File Validation, Mongoose Operations
       │
       ▼
 [ Database Layer ]  ──────► MongoDB via Mongoose Schemas & Indexes
       │
       ▼
[ Standardized Response ] ──► { success: true/false, message, data }
```

---

### Database Schemas & Data Models

#### 1. `User` Schema (`src/models/User.js`)
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `passwordHash` (String, required, selected out by default)
- `role` (Enum: `'candidate'`, `'recruiter'`, default: `'candidate'`)
- `createdAt`, `updatedAt` (Timestamps)

#### 2. `CandidateProfile` Schema (`src/models/CandidateProfile.js`)
- `userId` (ObjectId ref `'User'`, unique)
- `phone`, `location`, `bio` (Strings)
- `skills` (Array of Strings)
- `experience` (Array of objects: `title`, `company`, `duration`, `description`)
- `education` (Array of objects: `degree`, `institution`, `year`)
- `resume` Subdocument: `originalName`, `storedName`, `path`, `mimeType`, `size`, `uploadedAt`
- `completePercentage` (Number, 0 to 100, automatically computed)

#### 3. `Job` Schema (`src/models/Job.js`)
- `recruiterId` (ObjectId ref `'User'`, required)
- `title`, `company`, `location`, `description` (Strings, required)
- `skills` (Array of Strings)
- `experienceLevel` (Enum: `'Entry-Level'`, `'Mid-Level'`, `'Senior'`, `'Lead'`)
- `workMode` (Enum: `'Remote'`, `'Hybrid'`, `'On-site'`)
- `isActive` (Boolean, default `true` for soft deletion)

#### 4. `Application` Schema (`src/models/Application.js`)
- `candidateId` (ObjectId ref `'User'`, required)
- `jobId` (ObjectId ref `'Job'`, required)
- `stage` (Enum: `'Applied'`, `'Screening'`, `'Interview'`, `'Shortlisted'`, `'Offer'`, `'Hired'`, `'Rejected'`, default: `'Applied'`)
- `appliedAt` (Date)
- **Database Index Constraint**: `applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true })`

---

### Security & Authentication Subsystem

1. **HTTP-Only Cookie Flow**:
   - Upon successful login or signup, the backend creates a signed JWT containing `{ userId, role }`.
   - The token is attached to the HTTP response using `res.cookie('token', token, options)`:
     ```javascript
     res.cookie("token", token, {
       httpOnly: true, // Inaccessible to JavaScript (XSS safe)
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
     });
     ```
2. **Auth Middleware (`src/middleware/auth.js`)**:
   - Checks `req.cookies.token`.
   - Decodes JWT signature using `JWT_SECRET`.
   - Retrieves the user record from MongoDB (`User.findById(decoded.userId).select('-passwordHash')`).
   - Attaches candidate/recruiter record to `req.user`.

---

### Binary Resume Verification Subsystem

Rather than trusting browser MIME-types or file extensions, `src/utils/fileValidator.js` inspects the raw file header bytes stored in memory buffers:

- **PDF Inspection (`isPDF`)**: Verifies the first 5 header bytes equal ASCII `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`).
- **DOCX Inspection (`isDOCX`)**: Verifies the ZIP signature `PK\x03\x04` (`0x50 0x4B 0x03 0x04`) and confirms internal Word XML structures (`word/document.xml`).
- **Disk Unlinking**: When a candidate uploads a new resume, any previous resume file stored on disk is safely unlinked using `fs.unlinkSync()`.

---

### Complete REST API Specification

#### Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Verify backend service status |

#### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Body Payload | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | `{ name, email, password, role }` | Register new user & set cookie |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate & set cookie |
| `POST` | `/api/auth/logout` | Public | *None* | Clear auth cookie |
| `GET` | `/api/auth/me` | Authenticated | *None* | Get current user profile |

#### Candidate Profile Routes (`/api/profile`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/profile` | Candidate | Retrieve candidate profile & completeness |
| `PUT` | `/api/profile` | Candidate | Update profile fields, experience, skills |
| `POST` | `/api/profile/resume` | Candidate | Upload binary resume (multipart/form-data) |
| `GET` | `/api/profile/resume` | Authenticated | Download candidate resume binary |

#### Job Management Routes (`/api/jobs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | List active job postings with search/filter |
| `GET` | `/api/jobs/:id` | Public | Get single job details |
| `GET` | `/api/jobs/recruiter/my-jobs` | Recruiter | Get job postings created by recruiter |
| `POST` | `/api/jobs` | Recruiter | Create and publish a new job opening |
| `PUT` | `/api/jobs/:id` | Recruiter | Update existing job posting |
| `DELETE` | `/api/jobs/:id` | Recruiter | Toggle soft deletion (`isActive: false`) |

#### Application Routes (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Candidate | Apply for a job (`{ jobId }`) |
| `GET` | `/api/applications/my-applications` | Candidate | List applications submitted by candidate |
| `GET` | `/api/applications/job/:jobId` | Recruiter | List candidate applicants for job |
| `PATCH` | `/api/applications/:id/status` | Recruiter | Update applicant recruitment stage |

---

## 🎨 How the Frontend Works

### Frontend Architecture & Component Layout

The frontend is a single-page React 18 application bundled with Vite.

```text
frontend/src/
├── api/axios.js                # Pre-configured Axios client (withCredentials: true)
├── context/
│   ├── AuthContext.jsx         # Global user auth state, role helpers, login/logout actions
│   └── ToastContext.jsx        # Floating notifications (success, error, info)
├── components/
│   ├── common/                 # Navbar, Footer, Modal, Badge
│   ├── jobs/                   # JobCard, JobFilter, JobDetailModal, PostJobModal
│   ├── profile/                # ProfileMeter, ProfileEditModal, ResumeUpload
│   └── recruiter/              # ApplicantCard, JobApplicationsModal
└── pages/
    ├── Home.jsx                # Landing page with hero banner & job highlights
    ├── BrowseJobs.jsx          # Discovery hub with live keyword/filter search
    ├── Dashboard.jsx           # Dynamic portal (Candidate Applications or Recruiter Postings)
    ├── Login.jsx               # Auth tabs (Login / Signup) & role selection
    └── NotFound.jsx            # 404 page
```

---

### Global State Management (Context API)

1. **`AuthContext.jsx`**:
   - Manages state variables: `user`, `loading`, `isCandidate`, `isRecruiter`.
   - Invokes `/api/auth/me` during initial mount to restore session from cookie.
   - Exposes `login()`, `signup()`, and `logout()` helper functions throughout the component tree.
2. **`ToastContext.jsx`**:
   - Displays floating, animated feedback toasts for actions (e.g. successful application, error alerts, upload status).

---

### API Integration & Axios Interceptors

All API communication routes through `src/api/axios.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Enables cookie passing in cross-origin & proxied requests
});

export default api;
```

In development, Vite proxies `/api` requests to `http://localhost:5000` via `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

---

### Design System & Glassmorphism UI

- **Color System**: Clean Light Theme design system built with custom CSS tokens in `index.css`.
- **Glassmorphism Design Tokens**: `.glass-panel` and `.glass-card` CSS classes providing backdrop blur effects, subtle borders, and soft shadow elevations.
- **Micro-Animations**: Custom CSS animations (`animate-glow`, smooth hover lifts, dynamic progress meters).

---

## 🧪 Automated Testing & QA

The repository includes a comprehensive Jest integration test suite in `backend/tests/integration`:

### Running Tests
```bash
cd backend
npm test
```

### Test Coverage Highlights
- **`auth.test.js`**: User registration, password hashing verification, role assignment, login authentication, cookie generation, and logout.
- **`resume.test.js`**: Binary file magic-byte validation rejecting fake files and permitting valid `%PDF-` files, plus download access scoping.
- **`job.test.js`**: Recruiter job creation, updating, soft deletion, and recruiter ownership authorization checks.
- **`application.test.js`**: Candidate job submission and MongoDB compound index constraint testing ensuring duplicate prevention (`409 Conflict`).

---

## 🚀 Production Deployment Guide (Render + Vercel)

### Step 1: MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster.
2. Under **Network Access**, allow access (`0.0.0.0/0`).
3. Obtain connection string: `mongodb+srv://admin:<password>@cluster.mongodb.net/nexhire?retryWrites=true&w=majority`.

### Step 2: Deploy Backend API to Render
1. Log into [Render Dashboard](https://dashboard.render.com).
2. Create **New Web Service** linked to your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Set Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *Your MongoDB Atlas URI*
   - `JWT_SECRET` = *Your secret key*
   - `CLIENT_URL` = *Your Vercel URL (e.g. `https://nexhire.vercel.app`)*

### Step 3: Deploy Frontend to Vercel
1. Log into [Vercel Dashboard](https://vercel.com).
2. Import GitHub repository and choose `frontend` directory.
3. Set Framework Preset to **Vite**.
4. Environment Variables:
   - `VITE_API_URL` = *Your Render Backend URL (e.g. `https://nexhire-backend.onrender.com`)*
5. Click **Deploy**.

---

*NexHire — Modern Talent Acquisition Platform*
