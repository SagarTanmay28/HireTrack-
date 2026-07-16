# HireTrack — Job Application Tracker

HireTrack is a full-stack job application tracker built to help users manage the complete journey of applying for jobs.
It allows users to save applications, track their progress through stages like Applied, Interview, Offer, Rejected, and Ghosted, view analytics on their pipeline, and receive follow-up reminders.

This project is also a good interview-ready example because it shows full-stack development, authentication, database integration, analytics, and scheduled background jobs in one app.

**Live Demo:** [your-link-here]

---

## Simple Project Explanation

Think of HireTrack as a personal dashboard for job seekers.
A user can:
- sign up or log in
- add a new job application
- update the current stage of the application
- search and filter applications
- export all applications as CSV
- view a dashboard with charts and upcoming follow-ups

The frontend is built with React and the backend is built with Node.js and Express.
All data is stored in PostgreSQL.

---

## Request Flow of the Project

### 1. User opens the app
The browser loads the React frontend. If the user is not logged in, they are shown the authentication page.

### 2. User logs in
The frontend sends the login request to the backend. The backend verifies the email and password and returns a JWT access token. A refresh token is also stored securely in an HTTP-only cookie.

### 3. User interacts with applications
When the user adds, edits, or deletes an application, the frontend sends requests to the backend. The backend validates the data and interacts with PostgreSQL.

### 4. Dashboard fetches analytics
The dashboard page requests analytics data from the backend. The backend runs SQL queries to build summary counts and trend data for the charts.

### 5. Reminder emails are sent automatically
A scheduled cron job checks for follow-up dates that match today and sends reminder emails to the user.

---

## Architecture

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────┐
│   React (Vite)  │  HTTP  │  Node.js/Express │  SQL   │ PostgreSQL  │
│   + Recharts    │◄──────►│  REST API        │◄──────►│             │
│   Port 5173     │        │  Port 5000       │        │  Port 5432  │
└─────────────────┘        └──────────────────┘        └─────────────┘
                                    │
                              node-cron
                            (daily 8AM)
                                    │
                              Nodemailer
                           (Gmail SMTP)
```

**Auth Flow:**
- Access token (JWT, 15 min) → stored in localStorage, sent in `Authorization` header
- Refresh token (JWT, 7 days) → stored in HTTP-only cookie (XSS-safe)
- Auto silent refresh via Axios interceptor when access token expires

---

## Features

- **Application Tracking** — Add, edit, delete applications with company, role, status, dates, notes, salary, location
- **5 Status Stages** — Applied → Interview → Offer → Rejected → Ghosted
- **Analytics Dashboard** — Funnel bar chart, weekly activity trend, upcoming follow-ups
- **Follow-up Reminders** — Automated daily email reminders via node-cron + Nodemailer
- **CSV Export** — Download all applications as a spreadsheet
- **JWT Auth from scratch** — No Firebase/Auth0; refresh token rotation implemented manually
- **Docker Compose** — One command to run entire stack locally

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Recharts, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL (via `pg` driver) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Scheduling | node-cron + Nodemailer |
| Containerisation | Docker, Docker Compose, Nginx |
| Deployment | Render (backend), Vercel (frontend) |
| CI/CD | GitHub Actions |

---

## Local Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend
```bash
cd backend
cp .env.example .env    # Fill in your values
npm install
npm run dev             # Starts on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # Starts on port 5173
```

---

## Local Setup (With Docker) — Recommended

```bash
# Clone the repo
git clone https://github.com/yourusername/hiretrack.git
cd hiretrack

# Start everything (DB + backend + frontend)
docker-compose up --build

# App is now running at:
# Frontend: http://localhost
# Backend:  http://localhost:5000
# DB:       localhost:5432
```

> **First run:** Docker will pull images, build containers, and auto-create all DB tables. Takes ~2 minutes.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `DB_*` | PostgreSQL connection details |
| `JWT_SECRET` | Long random string (use `openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | Different long random string |
| `EMAIL_USER` | Gmail address for sending reminders |
| `EMAIL_PASS` | Gmail App Password (not your real password) |

**Getting Gmail App Password:**
1. Go to Google Account → Security → 2-Step Verification
2. At the bottom → App Passwords
3. Generate a password for "Mail" → use that as `EMAIL_PASS`

---

## Deployment

### Backend → Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, select `backend/` as root
4. Set all env variables from `.env.example`
5. Build command: `npm install` | Start command: `node src/index.js`
6. Add a PostgreSQL database on Render and copy the connection URL

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set root to `frontend/`
3. Add environment variable: `VITE_API_URL=https://your-render-backend-url.com`
4. Deploy — Vercel auto-detects Vite

### CI/CD
Add these to GitHub Secrets:
- `RENDER_DEPLOY_HOOK` — from Render service settings
- `VITE_API_URL` — your Render backend URL

Every push to `main` auto-deploys both frontend and backend.

---

## Common Interview Questions

### What is the purpose of this project?
This project is a job application tracker that helps users manage applications, track stages, view analytics, and receive follow-up reminders.

### How is the frontend connected to the backend?
The frontend uses Axios to send HTTP requests to the backend API. The backend exposes REST endpoints for authentication, applications, and analytics.

### How is authentication handled?
The app uses JWT authentication. Access tokens are used for regular requests, and refresh tokens are stored in HTTP-only cookies for better security.

### What is the role of the database?
PostgreSQL stores user accounts, applications, and refresh tokens.

### What is the dashboard built from?
The dashboard is built from backend analytics endpoints that return counts and trends. The frontend renders them with charts.

### How are reminder emails sent?
The backend uses node-cron to run scheduled jobs and nodemailer to send emails when follow-up dates are due.

### Why is this project good for interviews?
It demonstrates full-stack development, secure auth, database design, REST APIs, analytics, background jobs, and deployment readiness.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token (uses cookie) |
| POST | `/api/auth/logout` | Logout + clear cookie |
| GET | `/api/auth/me` | Get current user |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get all (supports `?status=&search=`) |
| POST | `/api/applications` | Create new |
| PUT | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |
| GET | `/api/applications/export/csv` | Download CSV |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/summary` | Counts per status |
| GET | `/api/analytics/weekly` | Weekly trend (8 weeks) |
| GET | `/api/analytics/followups` | Upcoming follow-ups |

---

## Project Structure

```
hiretrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # PostgreSQL pool + table init
│   │   │   ├── jwt.js         # Token generation/verification
│   │   │   └── cron.js        # Scheduled email reminders
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT verification middleware
│   │   │   └── errorHandler.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── applicationController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── applications.js
│   │   │   └── analytics.js
│   │   └── index.js           # Express app entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance + refresh interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── layout/Sidebar.jsx
│   │   │   ├── layout/ProtectedLayout.jsx
│   │   │   └── ApplicationModal.jsx
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Applications.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── nginx.conf
├── .github/workflows/deploy.yml
└── docker-compose.yml
```
