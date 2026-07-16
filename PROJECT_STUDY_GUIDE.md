# HireTrack — Complete Step-by-Step Study Guide

This guide is written for learning the project in the same order it was built and executed.
Use it like a roadmap:
- read the file
- understand its job
- see what file calls it next
- understand the flow from startup to UI interaction

The goal is to learn the project from beginning to end, file by file, without jumping randomly.

---

## 1. First, understand the project idea

Before reading the code, understand the purpose of the app.

HireTrack is a job application tracker.
It helps users:
- register and log in
- add job applications
- update application status
- search and filter applications
- view analytics on the dashboard
- receive reminder emails for follow-ups

So the project is not just frontend or backend. It is a full-stack app with authentication, database, APIs, charts, and scheduled jobs.

---

## 2. Start from the top-level project files

### Read this first: [README.md](README.md)
This gives the big picture.
It tells you:
- what the app does
- what technologies are used
- how frontend and backend connect
- how the project is structured

After reading this, you should know the app’s purpose before opening source code.

### Next: [docker-compose.yml](docker-compose.yml)
This file tells you how the app is run as a complete system.
It defines:
- the database container
- the backend container
- the frontend container

This is the first file to understand if you want to know how the whole project starts together.

### Then read: [backend/package.json](backend/package.json)
This file shows:
- the backend dependencies
- the scripts used to run the server

### Then read: [frontend/package.json](frontend/package.json)
This file shows:
- the frontend dependencies
- the scripts used to start the React app

---

## 3. Understand how the backend starts

### Read first: [backend/src/index.js](backend/src/index.js)
This is the main backend entry file.
It is the file that starts the server.

When you open this file, understand this flow:
1. it loads environment variables
2. it creates an Express app
3. it enables CORS and cookie parsing
4. it attaches middleware
5. it mounts all route files
6. it starts the server
7. it initializes the database
8. it starts the cron job system

This file is the backbone of the backend.
If someone asks, “Where does the backend start?”, this is the answer.

### What happens after [backend/src/index.js](backend/src/index.js) runs?
It calls:
- [backend/src/config/db.js](backend/src/config/db.js)
- [backend/src/config/cron.js](backend/src/config/cron.js)

So the startup flow is:
- server starts
- database initializes
- reminder jobs begin

---

## 4. Learn the database layer first

### Read: [backend/src/config/db.js](backend/src/config/db.js)
This file is very important because it connects the app to PostgreSQL.

Inside this file you learn:
- how the database connection pool is created
- what tables are created
- how the app ensures the database structure exists before use

The tables created here are:
- users
- applications
- refresh_tokens

This is the data layer of the project.
If the app wants to save or read data, this file is part of the path.

### Why this file matters
Without this file:
- the app cannot connect to the database
- the users table and applications table would not exist
- authentication and application storage would fail

---

## 5. Learn the authentication system

### Read: [backend/src/config/jwt.js](backend/src/config/jwt.js)
This file is the security base of the app.
It handles:
- access token generation
- refresh token generation
- access token verification
- refresh token verification

### Why this file matters
Authentication in this app depends on JWT.
This file is where the app decides how tokens are created and verified.

### Next read: [backend/src/middleware/auth.js](backend/src/middleware/auth.js)
This file is the guard for protected routes.
It runs before protected API endpoints.

Its job is:
- read the token from the Authorization header
- verify it
- attach the user id to the request
- allow the request to continue if valid
- return 401 if invalid

### Then read: [backend/src/routes/auth.js](backend/src/routes/auth.js)
This file defines the authentication routes.
It maps URLs to controller functions.

The main routes are:
- register
- login
- refresh
- logout
- me

### Then read: [backend/src/controllers/authController.js](backend/src/controllers/authController.js)
This file contains the real logic for authentication.
It handles:
- user signup
- password hashing with bcrypt
- login checks
- token creation
- refresh token storage
- logout
- fetching current user data

### Execution flow of auth
The flow is:
1. frontend sends auth request
2. route receives the request
3. controller checks the request body
4. database is queried
5. password is verified
6. token is created
7. response is sent back

This is one of the most important parts of the app.

---

## 6. Learn the application management flow

### Read: [backend/src/routes/applications.js](backend/src/routes/applications.js)
This file defines all routes for managing applications.
It is the route layer for CRUD operations.

The routes inside are:
- get all applications
- get one application
- create application
- update application
- delete application
- export CSV

### Then read: [backend/src/controllers/applicationController.js](backend/src/controllers/applicationController.js)
This file contains the business logic for applications.
It handles:
- reading applications from the database
- creating new applications
- updating existing ones
- deleting records
- exporting CSV data

### What this controller does in simple terms
It is the main logic layer between the API and the database.
If the frontend asks for applications, this file responds.

### Why this file matters
This is the core feature of the app.
If you understand this file, you understand the main value of the project.

---

## 7. Learn the analytics flow

### Read: [backend/src/routes/analytics.js](backend/src/routes/analytics.js)
This file exposes the analytics endpoints.
These routes power the dashboard charts.

### Then read: [backend/src/controllers/analyticsController.js](backend/src/controllers/analyticsController.js)
This file builds the data shown on the dashboard.
It returns:
- application counts by status
- weekly activity trend
- upcoming follow-ups

### Why this matters
The dashboard is not just a UI feature.
It depends on carefully written backend queries.

---

## 8. Learn the reminder system

### Read: [backend/src/config/cron.js](backend/src/config/cron.js)
This file handles scheduled reminder emails.
It uses:
- node-cron for scheduling
- nodemailer for sending emails

### What happens here?
At a scheduled time, the app checks the database for applications that need follow-up today.
Then it sends email reminders to the user.

This is a good example of background jobs in a real app.

---

## 9. Learn the backend error handling

### Read: [backend/src/middleware/errorHandler.js](backend/src/errorHandler.js)
This file is the centralized error handler.
It makes sure that if something fails, the server returns a clean response instead of crashing badly.

This is a good file to understand because real applications need strong error handling.

---

## 10. Now move to the frontend entry point

### Read: [frontend/src/main.jsx](frontend/src/main.jsx)
This is the first frontend file executed in the browser.
It mounts the React app into the DOM.

### Then read: [frontend/src/App.jsx](frontend/src/App.jsx)
This file defines the route structure.
It decides which screen should appear for each URL.

The route structure includes:
- login page
- dashboard page
- applications page

This file connects the entire UI to the router.

---

## 11. Learn the frontend authentication state

### Read: [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)
This file is the heart of frontend authentication state.
It stores:
- the current user
- loading state
- login function
- register function
- logout function

This is the global authentication context used by the app.

### Why this file matters
Instead of passing login state manually through many components, the app uses context.
This is a clean React pattern.

---

## 12. Learn the shared API layer

### Read: [frontend/src/api/axios.js](frontend/src/api/axios.js)
This is the central API wrapper.
It creates a shared Axios instance for all API calls.

It does three big jobs:
1. attach the access token to requests
2. automatically refresh the token when needed
3. redirect the user to login if refresh fails

This file is very important because it connects the UI to the backend in a clean way.

---

## 13. Learn the protected layout and navigation

### Read: [frontend/src/components/layout/ProtectedLayout.jsx](frontend/src/components/layout/ProtectedLayout.jsx)
This file protects pages that require login.
It checks whether the user is authenticated.
If not, it redirects them.

### Then read: [frontend/src/components/layout/Sidebar.jsx](frontend/src/components/layout/Sidebar.jsx)
This file creates the left-side navigation menu.
It gives links to:
- dashboard
- applications
- sign out

This is part of the app layout and user experience.

---

## 14. Learn the login and registration experience

### Read: [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx)
This is the login and signup page.
It allows users to:
- switch between login and register mode
- enter email and password
- submit the form
- receive errors from the backend

This page uses the authentication context to log the user in.

---

## 15. Learn the applications page

### Read: [frontend/src/pages/Applications.jsx](frontend/src/pages/Applications.jsx)
This is the main page for the application list.
It shows:
- search input
- status filter buttons
- add application button
- export CSV button
- table of applications

It also calls the backend APIs for:
- fetching data
- deleting an application
- exporting CSV

### What happens when the user clicks add or edit?
The page opens the modal component.

---

## 16. Learn the modal form component

### Read: [frontend/src/components/ApplicationModal.jsx](frontend/src/components/ApplicationModal.jsx)
This file is the form used to add or edit an application.
It collects:
- company
- role
- status
- dates
- notes
- job URL
- salary range
- location

When the user submits the form:
- if editing, it sends a PUT request
- if creating, it sends a POST request

This is a good file to understand because it shows how the UI collects and submits data.

---

## 17. Learn the dashboard page

### Read: [frontend/src/pages/Dashboard.jsx](frontend/src/pages/Dashboard.jsx)
This page shows the analytics view.
It fetches data from:
- summary endpoint
- weekly endpoint
- follow-up endpoint

Then it renders:
- summary cards
- funnel chart
- weekly activity chart
- upcoming follow-up list

This page is the visual representation of the backend analytics logic.

---

## 18. Learn the styling layer

### Read: [frontend/src/index.css](frontend/src/index.css)
This file defines the visual design of the app.
It contains:
- colors
- card styles
- button styles
- input styles
- badge styles

This is the styling layer that makes the app look polished.

---

## 19. Learn the frontend build and dev setup

### Read: [frontend/vite.config.js](frontend/vite.config.js)
This file configures the frontend dev server.
It sets the port and proxies API calls to the backend.

This is important because the frontend runs on one port and the backend on another.
The proxy makes development easier.

### Read: [frontend/index.html](frontend/index.html)
This is the HTML entry file.
It loads the React app into the page.

### Read: [frontend/Dockerfile](frontend/Dockerfile)
This defines how the frontend is containerized for production.
It builds the React app and serves it using Nginx.

### Read: [backend/Dockerfile](backend/Dockerfile)
This defines how the backend is containerized.
It installs dependencies and starts the Node.js server.

### Read: [frontend/nginx.conf](frontend/nginx.conf)
This config helps React Router work correctly when the app is served by Nginx.

---

## 20. End-to-end execution path

Here is the full flow from start to finish.

### Startup path
1. Docker Compose starts the database, backend, and frontend.
2. Backend starts from [backend/src/index.js](backend/src/index.js).
3. Database is initialized from [backend/src/config/db.js](backend/src/config/db.js).
4. Cron jobs start from [backend/src/config/cron.js](backend/src/config/cron.js).

### User login path
1. User opens the app.
2. React router loads the auth page from [frontend/src/App.jsx](frontend/src/App.jsx).
3. User submits form from [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx).
4. Auth context sends request via [frontend/src/api/axios.js](frontend/src/api/axios.js).
5. Backend route in [backend/src/routes/auth.js](backend/src/routes/auth.js) handles it.
6. Controller in [backend/src/controllers/authController.js](backend/src/controllers/authController.js) processes it.
7. JWT is created in [backend/src/config/jwt.js](backend/src/config/jwt.js).

### Application flow
1. User opens the applications page.
2. [frontend/src/pages/Applications.jsx](frontend/src/pages/Applications.jsx) calls the API.
3. Backend route in [backend/src/routes/applications.js](backend/src/routes/applications.js) handles it.
4. Controller in [backend/src/controllers/applicationController.js](backend/src/controllers/applicationController.js) connects to the database.
5. The response comes back and the table updates.

### Dashboard flow
1. Dashboard page loads.
2. It calls analytics endpoints.
3. Backend analytics controller builds the needed statistics.
4. The frontend renders charts and cards.

### Reminder email flow
1. Cron job runs on schedule.
2. [backend/src/config/cron.js](backend/src/config/cron.js) checks applications.
3. It sends emails through nodemailer.

---

## 21. Best way to study this project

If you want to learn it properly, follow this order:

1. Read [README.md](README.md)
2. Read [docker-compose.yml](docker-compose.yml)
3. Understand [backend/src/index.js](backend/src/index.js)
4. Learn database setup in [backend/src/config/db.js](backend/src/config/db.js)
5. Learn authentication in [backend/src/config/jwt.js](backend/src/config/jwt.js), [backend/src/middleware/auth.js](backend/src/middleware/auth.js), and [backend/src/controllers/authController.js](backend/src/controllers/authController.js)
6. Learn application logic in [backend/src/controllers/applicationController.js](backend/src/controllers/applicationController.js)
7. Learn analytics in [backend/src/controllers/analyticsController.js](backend/src/controllers/analyticsController.js)
8. Learn frontend entry in [frontend/src/main.jsx](frontend/src/main.jsx) and [frontend/src/App.jsx](frontend/src/App.jsx)
9. Learn shared state in [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)
10. Learn API communication in [frontend/src/api/axios.js](frontend/src/api/axios.js)
11. Learn screens in [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx), [frontend/src/pages/Applications.jsx](frontend/src/pages/Applications.jsx), and [frontend/src/pages/Dashboard.jsx](frontend/src/pages/Dashboard.jsx)
12. Learn the styling in [frontend/src/index.css](frontend/src/index.css)

---

## 22. Short summary you can say in an interview

“I studied the project from the backend startup flow to the frontend UI flow. The app starts with the backend server, connects to PostgreSQL, handles authentication with JWT, exposes REST APIs for applications and analytics, and uses React on the frontend to render the dashboard and application pages. I also learned how cron jobs send reminder emails and how Docker runs the full stack together.”

---

## 23. Final tip

When you study this project, do not only read the code.
Also ask these questions while reading:
- What file runs first?
- What file is called after that?
- Which file sends the API request?
- Which file handles the database logic?
- Which file renders the screen?
- What is the data flow from UI to database and back?

If you answer these questions while reading, you will understand the project deeply.
