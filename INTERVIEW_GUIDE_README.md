# HireTrack Interview Guide

This document explains the HireTrack project in a simple and interview-friendly way.
It is designed for someone who wants to understand the project deeply, explain it clearly in an interview, and answer common questions about the architecture and implementation.

---

## 1. What is HireTrack?

HireTrack is a full-stack job application tracker.
It helps users:
- save job applications
- track their current stage such as Applied, Interview, Offer, Rejected, or Ghosted
- view analytics on their progress
- receive follow-up reminder emails
- export their data as CSV

In simple words, it is like a personal dashboard for job seekers.

---

## 2. Project Goal

The main objective of this project is to build a practical application that combines:
- frontend UI
- backend APIs
- authentication
- database storage
- scheduled background jobs
- analytics visualization

This makes it a strong example of a real-world full-stack application.

---

## 3. Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Recharts
- date-fns
- lucide-react

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT authentication
- bcryptjs
- node-cron
- nodemailer

### DevOps / Deployment Support
- Docker
- Docker Compose
- Nginx

---

## 4. Project Structure

```text
hiretrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 5. Request Flow of the Project

Here is the complete flow from the user action to the database and back.

### A. User opens the app
1. The browser loads the frontend.
2. React Router checks the URL.
3. If the user is not logged in, they are sent to the login/register page.

### B. User logs in
1. The frontend sends login data to the backend API.
2. The backend checks the email and password in the PostgreSQL database.
3. If valid, the backend creates a JWT access token and a refresh token.
4. The access token is returned to the frontend and stored in localStorage.
5. The refresh token is stored in an HTTP-only cookie for security.

### C. User views applications
1. The frontend calls the applications API.
2. The authentication middleware checks the JWT.
3. If valid, the controller fetches the user’s applications from the database.
4. The results are returned to the frontend and displayed in the table.

### D. User adds or updates an application
1. The user fills the form in the modal.
2. The frontend sends the data to the backend using POST or PUT.
3. The backend validates the input and inserts or updates the record in the database.
4. The frontend refreshes the list and shows the latest data.

### E. User deletes an application
1. The frontend sends a DELETE request.
2. The backend removes the row from the database.
3. The UI refreshes the list.

### F. Dashboard analytics flow
1. The frontend requests analytics endpoints.
2. The backend runs SQL queries to count applications by stage and recent activity.
3. The data is sent back and displayed in charts.

### G. Reminder emails flow
1. The backend runs a cron job every day at 8 AM.
2. It finds applications whose follow-up date is today.
3. It sends reminder emails using nodemailer.

---

## 6. Important Backend Files and Their Role

### backend/src/index.js
This is the main server file.
It starts Express, attaches middleware, mounts routes, and initializes the database.

### backend/src/config/db.js
This handles the PostgreSQL connection pool and creates the database tables if they do not already exist.

### backend/src/config/jwt.js
This file generates and verifies JWT tokens.
It is responsible for authentication security.

### backend/src/config/cron.js
This file runs scheduled reminder emails.

### backend/src/middleware/auth.js
This file protects routes.
If a request does not have a valid token, it returns a 401 error.

### backend/src/controllers/authController.js
This handles registration, login, refresh, logout, and profile retrieval.

### backend/src/controllers/applicationController.js
This handles create, read, update, delete, and CSV export of applications.

### backend/src/controllers/analyticsController.js
This builds dashboard data for charts and summary cards.

---

## 7. Important Frontend Files and Their Role

### frontend/src/App.jsx
This is the main router for the application.
It decides which page should show based on the URL.

### frontend/src/context/AuthContext.jsx
This provides global authentication state to the entire application.

### frontend/src/api/axios.js
This file manages API requests and handles automatic token refresh.

### frontend/src/pages/AuthPage.jsx
This is the login and signup page.

### frontend/src/pages/Applications.jsx
This displays all applications and supports add, edit, delete, search, and export actions.

### frontend/src/pages/Dashboard.jsx
This shows charts and analytics.

### frontend/src/components/ApplicationModal.jsx
This is the popup form used to create or edit an application.

---

## 8. Authentication Flow in Simple Words

The authentication flow is one of the most important parts of the project.

### Access token
- short-lived
- used for everyday API requests
- stored in localStorage

### Refresh token
- long-lived
- stored in an HTTP-only cookie
- used to get a new access token when the old one expires

This is a common and secure pattern used in modern apps.

---

## 9. Why this project is good for interviews

This project is interview-friendly because it demonstrates:
- full-stack development
- REST API design
- authentication and authorization
- database design
- secure token handling
- frontend state and routing
- dashboard analytics
- background job scheduling
- deployment readiness with Docker

A recruiter or interviewer can see that you understand how real applications are built end to end.

---

## 10. Common Interview Questions and Answers

### Q1. What is this project about?
A: It is a job application tracker that helps users manage applications, track progress, view analytics, and receive follow-up reminders.

### Q2. What is the architecture of the project?
A: It uses a React frontend, an Express backend, and a PostgreSQL database. The frontend calls REST APIs and the backend interacts with the database.

### Q3. How does authentication work in this project?
A: The backend issues JWT access and refresh tokens. The access token is used for API calls, and the refresh token is stored in a secure cookie to create a new access token when needed.

### Q4. Why do you use both access token and refresh token?
A: The access token is short-lived for security, while the refresh token is longer-lived so the user can stay logged in without exposing a long-lived access token.

### Q5. How do you protect routes?
A: Protected routes use authentication middleware that checks the JWT before the controller runs.

### Q6. What is the role of the database in this project?
A: The database stores user information, job applications, and refresh tokens.

### Q7. What does the controller do?
A: Controllers contain the business logic for operations such as login, creating applications, analytics, and exports.

### Q8. How does the dashboard get data?
A: The frontend calls analytics endpoints and the backend returns counts and trends from the database.

### Q9. What is the purpose of node-cron?
A: It allows the backend to run scheduled tasks such as sending reminder emails automatically.

### Q10. How does CSV export work?
A: The backend queries all applications for the logged-in user, formats them into CSV, and sends them as a downloadable file.

### Q11. How do you handle errors in the backend?
A: Errors are passed to a centralized error handler that returns a clean JSON response to the client.

### Q12. Why use Docker here?
A: Docker makes it easy to run the full project locally with a single command and keeps the environment consistent.

### Q13. What is the role of Axios in this project?
A: Axios is used for API requests and also for automatic token refresh when the user’s session expires.

### Q14. How would you improve this project further?
A: Possible improvements include adding pagination, better testing, email templates, notifications, and deployment to cloud services.

---

## 11. Short Interview Summary

You can explain the project like this:

“HireTrack is a full-stack job application tracker built with React and Express. Users can register, log in, add job applications, update their progress across different stages, view dashboard analytics, and receive follow-up reminders. The app uses PostgreSQL for storage, JWT for authentication, Axios for API communication, and Docker for easy setup.”

---

## 12. Bonus Tips for Presentation

When explaining this project in an interview:
- start with the problem it solves
- explain the architecture clearly
- mention authentication and database flow
- highlight one interesting feature like token refresh or scheduled reminders
- talk about what you learned while building it

---

## 13. Suggested Talking Points

- I built a full-stack app with separate frontend and backend layers.
- I implemented secure authentication using JWT tokens.
- I used PostgreSQL to persist user and application data.
- I created a dashboard with charts and analytics.
- I added automated follow-up reminders using cron jobs.
- I structured the app in a scalable way using controllers, routes, and middleware.

---

If you want, I can also turn this into a more polished presentation-style README with sections like “Problem, Solution, Architecture, Features, Challenges, and Learnings.”
