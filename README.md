# 🎯 HireTrack — Job Application Tracker

> A full-stack job application tracking system built with React, Node.js/Express, and PostgreSQL — complete with JWT authentication, analytics dashboards, and automated email reminders.

## Dashboard

![HireTrack Dashboard](HireTrack%20Dashboard.png)

## Application

![HireTrack Application](HireTrack%20Application.png)

## Job Description (JD) and System Design

![JD and SD](JD%20and%20SD.png)

## Technical Questions

![Technical Questions](Technical%20Q%20Page%20.png)

## Roadmap

![Roadmap](Roadmap%20Page%20.png)



---
## ✨ What HireTrack Does

HireTrack helps job seekers stay organized during their search. Users can:

- 🔐 Register and log in securely
- 📋 Add and manage job applications
- 🔄 Track and update application status (applied, interviewing, offer, rejected, etc.)
- 🔍 Search and filter applications
- 📊 View analytics on a visual dashboard
- 📧 Receive automated reminder emails for follow-ups

It spans **authentication, relational data modeling, REST APIs, data visualization, and scheduled background jobs** — a genuinely full-stack feature set.


## 🧩 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Axios, React Router |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Scheduled Jobs** | node-cron, nodemailer |
| **Infrastructure** | Docker, Docker Compose, Nginx |

---

## 🔐 Why this Authentication Design ??

Rather than a single long-lived token, the app implements a proper **access + refresh token pattern**:

- `backend/src/config/jwt.js` handles token generation and verification
- `backend/src/middleware/auth.js` guards protected routes, validating tokens before allowing requests through
- `frontend/src/api/axios.js` centralizes API calls, automatically attaches tokens, silently refreshes expired ones, and redirects to login on failure
- Passwords are hashed with **bcrypt** before storage

This is the kind of pattern used in real production systems, not just a toy `localStorage` token check — a strong signal of security awareness.

---

## 📊 Feature Highlights

### Application Management 
Full create/read/update/delete flow for job applications, including CSV export — implemented cleanly across `routes/applications.js` and `controllers/applicationController.js`.

### Analytics Dashboard
Dedicated analytics endpoints (`routes/analytics.js`, `controllers/analyticsController.js`) power:
- Application counts by status
- Weekly activity trends
- Upcoming follow-up tracking

The dashboard isn't just decorative charts glued onto static data — it's backed by purpose-built database queries.

### Automated Reminder Emails
A `node-cron` job checks daily for applications needing follow-up and sends reminder emails via `nodemailer` — a great example of implementing background/scheduled work correctly in a Node app.

### Centralized Error Handling
A dedicated error-handling middleware ensures failures return clean, consistent responses instead of crashing the server — a small detail that reflects production-readiness.

---

## 📁 Project Structure

```
.
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js                 # App entry point
│       ├── config/
│       │   ├── db.js                # DB connection + schema init
│       │   ├── jwt.js               # Token generation/verification
│       │   └── cron.js              # Scheduled reminder emails
│       ├── middleware/
│       │   ├── auth.js              # Route protection
│       │   └── errorHandler.js      # Centralized error handling
│       ├── routes/
│       │   ├── auth.js
│       │   ├── applications.js
│       │   └── analytics.js
│       └── controllers/
│           ├── authController.js
│           ├── applicationController.js
│           └── analyticsController.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Route definitions
        ├── index.css                # Design system / styling
        ├── api/
        │   └── axios.js             # Shared API client
        ├── context/
        │   └── AuthContext.jsx      # Global auth state
        ├── components/
        │   ├── layout/
        │   │   ├── ProtectedLayout.jsx
        │   │   └── Sidebar.jsx
        │   └── ApplicationModal.jsx
        └── pages/
            ├── AuthPage.jsx
            ├── Applications.jsx
            └── Dashboard.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed

### Run the full stack

```bash
git clone <repository-url>
cd hiretrack
docker-compose up --build
```

This spins up the PostgreSQL database, the Express backend, and the React frontend (served via Nginx) together — no manual environment juggling required.

### Local development (without Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

The Vite dev server proxies API requests to the backend, so both can run independently during development.

---

## 🗺️ End-to-End Flow (for reviewers)

**Login:** `AuthPage.jsx` → `AuthContext` → `axios.js` → `routes/auth.js` → `authController.js` → `jwt.js`

**Applications:** `Applications.jsx` → `routes/applications.js` → `applicationController.js` → PostgreSQL → table updates

**Dashboard:** `Dashboard.jsx` → analytics endpoints → `analyticsController.js` → charts render

**Reminders:** `cron.js` runs on schedule → checks DB for due follow-ups → sends email via `nodemailer`

---


The core system is already solid, and these are the natural next additions to round it out into an even more complete job-search platform:

- 🔑 **OAuth Login (Google/GitHub)** — Sign in with existing Google or GitHub accounts, reducing signup friction alongside the current email/password + JWT flow.
- 📄 **Resume Upload** — Let users attach and store a resume against their profile or individual applications, so all their job-search materials live in one place.
- 🤖 **AI Resume Matching** — Compare an uploaded resume against a job description to surface match strength and skill gaps, helping users tailor applications before submitting.
- 🎤 **Interview Preparation Assistant** — An AI-assisted tool that generates likely interview questions and practice answers based on the role and company for a given application.

These additions would extend HireTrack from a tracking tool into a genuinely end-to-end job-search companion — and the existing architecture (modular routes/controllers, centralized API client, auth middleware) is well positioned to absorb them without a redesign.

---

