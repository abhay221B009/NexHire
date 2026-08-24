# NexHire Frontend — Master Technical Architecture & Developer Handbook

> **DEVELOPER & INTERVIEW HANDBOOK**
> Complete documentation covering the React + Tailwind CSS frontend architecture, HTTP-Only Cookie state synchronization, component design system, API client setup, and developer customization blueprints.

---

## Table of Contents
1. [Elevator Pitch & Interview Defense](#1-elevator-pitch--interview-defense)
2. [Frontend Architecture & Folder Structure](#2-frontend-architecture--folder-structure)
3. [Authentication & State Management Subsystem](#3-authentication--state-management-subsystem)
4. [Component Design System & UI Aesthetics](#4-component-design-system--ui-aesthetics)
5. [Candidate Workflow Subsystem](#5-candidate-workflow-subsystem)
6. [Recruiter Workflow Subsystem](#6-recruiter-workflow-subsystem)
7. [API Integration Layer & Proxy Configuration](#7-api-integration-layer--proxy-configuration)
8. [Developer Customization Playbook (How to Make Changes)](#8-developer-customization-playbook-how-to-make-changes)
9. [Running & Building for Production](#9-running--building-for-production)

---

## 1. Elevator Pitch & Interview Defense

When asked to explain the frontend of **NexHire** in technical interviews:

### 30-Second Pitch
> *"NexHire's frontend is a modern, single-page application built with **React**, **Vite**, and **Tailwind CSS v4**. It features role-based candidate and recruiter workspaces, seamless HTTP-Only cookie authentication using Axios interceptors, interactive drag-and-drop binary resume uploading with instant signature feedback, live search filtering, and real-time recruitment stage state machine tracking."*

### Key Architectural Highlights
1. **Security-First Auth Integration**: No tokens stored in `localStorage` (preventing XSS vulnerabilities). Axios client (`src/api/axios.js`) communicates via `withCredentials: true`, preserving HTTP-only cookie security across all endpoints.
2. **Glassmorphism Design Tokens**: Built using Tailwind CSS custom tokens, smooth gradient accents (`gradient-text`, `gradient-button`), custom micro-animations (`animate-glow`), and full mobile responsiveness.
3. **Dynamic Role-Based Views**: `AuthContext` provides global user roles (`isCandidate` vs `isRecruiter`), automatically switching dashboard capabilities and protected routes.

---

## 2. Frontend Architecture & Folder Structure

```
d:\NexHire\frontend\src\
├── api\
│   └── axios.js                # Axios client with credentials & error interceptors
├── context\
│   ├── AuthContext.jsx         # Global Auth state (user, login, signup, logout, role checks)
│   └── ToastContext.jsx        # Floating alert toast system (success, error, info, warning)
├── components\
│   ├── common\
│   │   ├── Navbar.jsx          # Responsive glass header with auth state & actions
│   │   ├── Footer.jsx          # Tech stack breakdown & quick navigation footer
│   │   ├── Modal.jsx           # Accessible backdrop modal with escape key listeners
│   │   └── Badge.jsx           # WorkModeBadge, StageBadge, and SkillTag badges
│   ├── jobs\
│   │   ├── JobCard.jsx         # Card component with work mode pill, skills, & apply action
│   │   ├── JobFilter.jsx       # Real-time search input, work mode pills, & experience dropdown
│   │   ├── JobDetailModal.jsx  # Full job description, candidate requirements, & application trigger
│   │   └── PostJobModal.jsx    # Recruiter modal form to publish new job listings
│   ├── profile\
│   │   ├── ProfileMeter.jsx    # Live profile completion score progress meter (0–100%)
│   │   ├── ProfileEditModal.jsx# Form to update phone, location, bio, experience, skills, education
│   │   └── ResumeUpload.jsx    # Drag-and-drop dropzone for binary PDF/DOCX resume validation
│   └── recruiter\
│       ├── ApplicantCard.jsx   # Candidate applicant item with stage dropdown & resume preview
│       └── JobApplicationsModal.jsx # Recruiter drawer to review all job applicants
├── pages\
│   ├── Home.jsx                # Landing page with hero banner, tech highlights, & featured jobs
│   ├── BrowseJobs.jsx          # Job discovery hub with live search & multi-field filtering
│   ├── Dashboard.jsx           # Dynamic dashboard for Candidate (My Applications) or Recruiter (My Jobs)
│   ├── Login.jsx               # Auth page with tab toggle for Login / Signup & role selection
│   └── NotFound.jsx            # 404 Error page
├── App.jsx                     # Route definitions & ProtectedRoute guard wrapper
├── index.css                   # Tailwind CSS imports, glassmorphism utilities, & animations
└── main.jsx                    # Entry point wrapping App in BrowserRouter
```

---

## 3. Authentication & State Management Subsystem

Authentication state is centralized in `src/context/AuthContext.jsx`:

- **State Managed**:
  - `user`: `{ _id, name, email, role }` or `null`
  - `loading`: boolean (initial session boot check)
  - `isCandidate`: boolean helper (`user?.role === 'candidate'`)
  - `isRecruiter`: boolean helper (`user?.role === 'recruiter'`)
- **API Methods**:
  - `login(email, password)`: Sends `POST /api/auth/login`. Sets HTTP-Only token cookie on backend.
  - `signup(name, email, password, role)`: Sends `POST /api/auth/signup`.
  - `logout()`: Sends `POST /api/auth/logout`. Clears backend token cookie & resets state.
  - `checkAuth()`: Sends `GET /api/auth/me` on initial app startup to restore session.

---

## 4. Component Design System & UI Aesthetics

- **Color Scheme**: Deep Slate palette (`bg-slate-950`, `bg-slate-900`) combined with Indigo (`#6366f1`), Violet (`#a855f7`), and Emerald (`#10b981`) accents.
- **Glassmorphism**: `.glass-panel` and `.glass-card` classes with `backdrop-filter: blur(...)` and subtle border highlights.
- **Status Badges (`StageBadge`)**:
  - `Applied`: Blue highlight
  - `Screening`: Purple highlight
  - `Interview`: Amber highlight
  - `Shortlisted`: Teal highlight
  - `Offer`: Emerald highlight
  - `Hired`: Green badge with pulsing bullet
  - `Rejected`: Rose highlight

---

## 5. Candidate Workflow Subsystem

1. **Profile Completion Calculation (`ProfileMeter.jsx`)**:
   - Scores profile completeness across 7 fields: Phone, Location, Bio, Skills, Experience, Education, Resume file.
2. **Binary Resume Upload (`ResumeUpload.jsx`)**:
   - Drag-and-drop dropzone supporting `.pdf` and `.docx` files up to 5MB.
   - Communicates with backend binary magic-byte validation (`%PDF-` / DOCX ZIP structures).
   - Single-click resume download trigger (`GET /api/profile/resume`).
3. **One-Click Application (`JobDetailModal.jsx`)**:
   - Sends `POST /api/applications` with `{ jobId }`.
   - Prevents duplicate applications gracefully with instant feedback badges.

---

## 6. Recruiter Workflow Subsystem

1. **Job Management (`PostJobModal.jsx` & `Dashboard.jsx`)**:
   - Publish new jobs with skills tag management.
   - Toggle job status between Active and Inactive (soft deletion).
   - Delete job postings.
2. **Applicant Review Pipeline (`JobApplicationsModal.jsx` & `ApplicantCard.jsx`)**:
   - Inspect all candidate applications submitted for a job.
   - View candidate profile metrics, experience, education, and skills.
   - Download applicant resumes directly.
   - Update candidate recruitment stage (`PATCH /api/applications/:id/status`).

---

## 7. API Integration Layer & Proxy Configuration

In `vite.config.js`, all `/api` requests are proxied to `http://localhost:5000`:
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
})
```

`src/api/axios.js` is pre-configured with `withCredentials: true`:
```javascript
import axios from 'axios';
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
export default api;
```

---

## 8. Developer Customization Playbook (How to Make Changes)

### How to Add a New Page
1. Create a new component file inside `src/pages/MyNewPage.jsx`.
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```
3. Add a link in `src/components/common/Navbar.jsx`.

### How to Add a New Field to Candidate Profile
1. Update `ProfileEditModal.jsx` to include the new input state.
2. Send the new field in `api.put('/profile', { myNewField })`.
3. Display the field in `Dashboard.jsx` under Personal Details.

---

## 9. Running & Building for Production

### Development Mode
```bash
# In d:\NexHire\frontend
npm run dev
```
Starts Vite dev server on `http://localhost:5173`.

### Production Build Verification
```bash
# In d:\NexHire\frontend
npx vite build
```
Generates optimized static bundle in `dist/`.
