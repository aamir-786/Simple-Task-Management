# TaskFlow - Premium Task Management Application

This repository contains a full-stack, secure, multi-user Task Management Web Application developed as part of the Software Engineering Internship technical assignment for **Effective Risk Management Pty Ltd**. 

The application has been heavily upgraded to include full JWT authentication, email verification flows, row-level database security, and a stunning premium glassmorphism UI.

**Live Demo (Vercel + Render):** [https://simple-task-management-nine.vercel.app/](https://simple-task-management-nine.vercel.app/)

---

## 🏗️ Project Architecture & Directory Structure

The project follows a clean, professional separation of concerns (Frontend and Backend) with an organized internal directory structure:

```text
simple-task-management/
│
├── backend/                  # Node.js & Express REST API
│   ├── middleware/           
│   │   └── auth.js           # JWT verification middleware
│   ├── routes/               # API Route handlers
│   │   ├── auth.js           # Registration, Login, Email Verification
│   │   └── tasks.js          # Secure CRUD operations (Row-Level Security)
│   ├── database.js           # SQLite connection & Schema definitions
│   ├── server.js             # Express app setup and middleware
│   └── .env                  # Backend environments (JWT_SECRET, SMTP credentials)
│
├── frontend/                 # React UI Application (Vite)
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── AuthForm.jsx  # Login/Registration UI
│   │   │   ├── TaskCard.jsx  # Individual task display
│   │   │   ├── TaskForm.jsx  # Modal Form for creating new tasks
│   │   │   ├── TaskList.jsx  # Grid rendering & empty states
│   │   │   └── ConfirmModal.jsx # Custom UI for delete confirmation
│   │   ├── api.js            # Centralized API fetch logic (Service Layer)
│   │   ├── App.jsx           # Main application state & layout
│   │   └── index.css         # Global premium glassmorphism design system
│   ├── vercel.json           # Vercel deployment configuration
│   └── .env                  # Local frontend environments
│
├── render.yaml               # Render Infrastructure as Code (Blueprint)
└── package.json              # Root package.json for concurrent running
```

---

## ✨ Features & Upgrades

1. **Robust Authentication & Security:** 
   - **JWT Sessions:** Fully implemented JSON Web Token authentication. All API routes are protected by custom middleware.
   - **Row-Level Security:** Tasks are strictly tied to specific `user_id`s. Users can absolutely only see, edit, or delete their own tasks.
   - **Email Verification:** Integrated Nodemailer with Gmail SMTP. Users must verify their email address via a generated secure token link before they can log in.

2. **Premium Custom UI/UX Design System:** 
   - Completely custom CSS grid-based full-screen dashboard layout.
   - Deep glassmorphism aesthetics (`backdrop-filter`), smooth hover animations, and floating action buttons (FABs) for mobile responsiveness.
   - Modal-based task creation instead of cluttered inline forms.

3. **Intelligent API Routing:**
   - The React frontend uses an environment-aware API configuration. It automatically connects to `localhost:5000` during local development, and seamlessly swaps to the live `Render` API URL when built for production on `Vercel`.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js (v20.x recommended)
- npm (Node Package Manager)

### 1. Install Dependencies
You can install all dependencies for both the frontend and backend simultaneously from the root directory:

```bash
# Navigate to the root directory
cd "Simple Task Management"

# Install dependencies for both frontend and backend automatically
npm run install-all
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Application
Start both the React frontend and the Node.js backend with a single command from the root directory:

```bash
npm run dev
```

- **Frontend:** Runs at [http://localhost:5173](http://localhost:5173)
- **Backend API:** Runs at [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Endpoints (Backend)

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth Required | Description |
|--------|---------|-------------|--------------|
| **POST** | `/auth/register` | No | Register user & send email |
| **GET**  | `/auth/verify/:token` | No | Verify user email |
| **POST** | `/auth/login` | No | Authenticate & receive JWT |
| **GET** | `/tasks` | **Yes** | Fetch all tasks for logged-in user |
| **POST** | `/tasks` | **Yes** | Create a new task |
| **PUT** | `/tasks/:id` | **Yes** | Update task status |
| **DELETE** | `/tasks/:id` | **Yes** | Delete a task |

---
*Developed as a Technical Assignment*  
*Name: Aamir Hussain*
