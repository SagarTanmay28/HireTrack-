# 🚀 HireTrack — Job Application Tracker

HireTrack is a **full-stack Job Application Tracker** built to help job seekers manage their complete job-search workflow in one place. It supports **200+ job applications per user** with secure authentication, application tracking, analytics, automated follow-ups, AI-powered resume analysis, and ATS-optimized resume generation.

## ✨ What HireTrack Does

- 🔐 **Secure Authentication** — JWT authentication with access + refresh tokens, refresh token rotation, HTTP-only cookies, bcrypt password hashing, and Google OAuth.
- 📋 **Application Management** — Create, update, delete, search, filter, and track job applications across statuses such as Applied, Interviewing, Offered, and Rejected.
- 📊 **Analytics Dashboard** — Visualize application statistics, status distribution, activity trends, and follow-up information.
- 📧 **Automated Follow-ups** — Node-cron automatically checks applications requiring follow-up and sends reminder emails using Nodemailer.
- 🤖 **Gemini AI Resume Analysis** — Parse resumes, extract skills, analyze job requirements, and identify skill gaps using Google Gemini AI.
- 📄 **ATS-Optimized Resume Generator** — Generate structured, ATS-friendly resumes dynamically and export them as PDFs using Puppeteer.
- 🗄️ **PostgreSQL Database** — Relational data modeling with REST APIs and database-backed analytics.
- 🐳 **Containerized Deployment** — Docker and Docker Compose for consistent development and deployment.
- ☁️ **Cloud Deployment** — Backend deployed on Render and frontend deployed on Vercel.

## 🧩 Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, Vite, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT, Refresh Token Rotation, Google OAuth, bcrypt |
| **AI** | Google Gemini AI |
| **Resume Generation** | Puppeteer |
| **Automation** | Node-cron, Nodemailer |
| **Deployment** | Docker, Docker Compose, Render, Vercel |
| **Web Server** | Nginx |

## 📸 Screenshots

### Dashboard

![HireTrack Dashboard](HireTrack%20Dashboard.png)

### Application

![HireTrack Application](HireTrack%20Application.png)

### Job Description & System Design

![JD and SD](JD%20and%20SD.png)

### Technical Questions

![Technical Questions](Technical%20Q%20Page%20.png)

### Roadmap

![Roadmap](Roadmap%20Page%20.png)

## 🔐 Authentication & Security

HireTrack follows a production-oriented authentication architecture using:

- JWT access and refresh tokens
- Refresh token rotation
- HTTP-only cookies
- Google OAuth
- bcrypt password hashing
- Protected Express.js routes
- Centralized authentication middleware

```text
User Login / Google OAuth
          ↓
    Authentication API
          ↓
 JWT Access + Refresh Tokens
          ↓
   HTTP-only Refresh Cookie
          ↓
 Protected Express.js Routes
          ↓
      PostgreSQL
```

## 📊 Application Management & Analytics

HireTrack provides a complete application lifecycle:

- Create and manage job applications
- Track application status
- Search and filter applications
- Track follow-up dates
- Export application data as CSV
- View application statistics
- Analyze weekly application activity
- Monitor upcoming follow-ups

The analytics dashboard is backed by dedicated PostgreSQL queries and REST API endpoints rather than static frontend data.

## 📧 Automated Follow-ups

A scheduled **Node-cron** background job checks the database for applications that require follow-up and automatically sends reminder emails through **Nodemailer**.

```text
Node-cron
    ↓
Check PostgreSQL
    ↓
Find Applications Due for Follow-up
    ↓
Nodemailer
    ↓
Reminder Email
```

## 🤖 Gemini AI Resume Analysis

HireTrack integrates **Google Gemini AI** to provide intelligent resume analysis.

The AI pipeline supports:

- Resume parsing
- Skill extraction
- Job requirement analysis
- Skill gap detection
- Resume optimization insights

```text
Resume Upload
     ↓
Gemini AI
     ↓
Resume Parsing
     ↓
Skill Extraction
     ↓
Job Requirement Analysis
     ↓
Skill Gap Detection
```

## 📄 ATS-Optimized Resume Generator

HireTrack includes an ATS-friendly resume generator that creates dynamic PDF resumes using **Puppeteer**.

```text
Resume Data
     ↓
Dynamic ATS Template
     ↓
HTML Rendering
     ↓
Puppeteer
     ↓
PDF Resume
```

## 🏗️ System Architecture

```text
                    ┌─────────────────┐
                    │   React + Vite  │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Axios API Client │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Node.js +       │
                    │ Express.js API  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        PostgreSQL       Gemini AI       Auth System
                                         JWT + OAuth
              │              │
              │              ├── Resume Parsing
              │              ├── Skill Extraction
              │              └── Skill Gap Detection
              │
              ├──────────────► Analytics
              │
              └──────────────► Applications

        Node-cron ─────────► Nodemailer
        Scheduled Jobs       Email Reminders

        Puppeteer ─────────► ATS Resume PDF
```

## 📁 Project Structure

```text
.
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/
│       │   ├── db.js
│       │   ├── jwt.js
│       │   └── cron.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
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
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
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


## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Docker & Docker Compose
- PostgreSQL

### Run with Docker

```bash
git clone <repository-url>
cd hiretrack
docker-compose up --build
```

### Local Development

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

## 🚢 Deployment

HireTrack uses a containerized and cloud-based deployment setup:

- 🐳 **Docker / Docker Compose** — Containerized services
- ⚙️ **Render** — Backend deployment
- ▲ **Vercel** — Frontend deployment
- 🗄️ **PostgreSQL** — Relational data storage
- 🌐 **Nginx** — Production frontend serving

## 📈 Project Highlights

- ⚡ Full-stack **React + Node.js + PostgreSQL** application
- 🔐 **JWT + Refresh Token Rotation + Google OAuth**
- 🍪 Secure **HTTP-only cookie** authentication
- 🤖 **Gemini AI** resume parsing and skill-gap detection
- 📄 **ATS-optimized PDF resume generation** using Puppeteer
- 📧 Automated follow-up emails using **Node-cron + Nodemailer**
- 📊 Data-driven analytics dashboard
- 📋 Designed to manage **200+ job applications per user**
- 🐳 Dockerized development and deployment
- ☁️ Deployed using **Render + Vercel**

---

### 🎯 Built With

**React • Vite • Node.js • Express.js • PostgreSQL • JWT • Google OAuth • Gemini AI • Puppeteer • Node-cron • Nodemailer • Docker • Render • Vercel**
