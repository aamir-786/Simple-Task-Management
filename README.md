# Effective-RM Task Management Application

This repository contains a full-stack Task Management Web Application developed as part of the Software Engineering Internship technical assignment for **Effective Risk Management Pty Ltd**. 

The application features a modern, responsive frontend and a robust RESTful API backend, prioritizing clean architecture, intuitive UI/UX, and proper code structure.

---

## 🏗️ Project Architecture & Directory Structure

The project follows a clean, professional separation of concerns (Frontend and Backend) with an organized internal directory structure:

```text
simple-task-management/
│
├── backend/                  # Node.js & Express REST API
│   ├── routes/               # API Route handlers (MVC routing)
│   │   └── tasks.js          # CRUD operations for tasks
│   ├── database.js           # SQLite connection & schema initialization
│   ├── server.js             # Express app setup and middleware
│   ├── database.sqlite       # Local SQLite database file
│   └── package.json          # Backend dependencies & scripts
│
├── frontend/                 # React UI Application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── TaskCard.jsx  # Individual task display component
│   │   │   ├── TaskForm.jsx  # Form for creating new tasks
│   │   │   ├── TaskList.jsx  # List rendering & empty states
│   │   │   └── ConfirmModal.jsx # Custom UI for delete confirmation
│   │   ├── api.js            # Centralized API fetch logic (Service Layer)
│   │   ├── App.jsx           # Main application state & layout
│   │   ├── main.jsx          # React DOM entry point
│   │   └── index.css         # Global styles & custom UI design system
│   └── package.json          # Frontend dependencies & scripts
│
├── package.json              # Root package.json for concurrent running
└── README.md                 # Project documentation
```

### Why this structure?
- **Separation of Concerns:** The frontend and backend are completely decoupled.
- **Service Layer (`api.js`):** Frontend API calls are abstracted into a single file, making the React components cleaner and easier to test.
- **Component-Based UI:** The UI is broken down into small, reusable pieces (`TaskCard`, `TaskList`, `TaskForm`, `ConfirmModal`).
- **Modular Routing:** Backend routes are separated from the main `server.js` file, making the API easily scalable.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### 1. Install Dependencies
You can install all dependencies for both the frontend and backend simultaneously from the root directory:

```bash
# Navigate to the root directory
cd "Simple Task Management"

# Install dependencies for both frontend and backend automatically
npm run install-all
```

*(Alternatively, you can manually run `npm install` inside both the `/frontend` and `/backend` folders.)*

### 2. Run the Application
You can start both the React frontend and the Node.js backend with a single command from the root directory:

```bash
# Run both servers concurrently
npm run dev
```

- **Frontend:** Runs at [http://localhost:5173](http://localhost:5173)
- **Backend API:** Runs at [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Endpoints (Backend)

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body |
|--------|---------|-------------|--------------|
| **GET** | `/tasks` | Fetch all tasks | *None* |
| **POST** | `/tasks` | Create a new task | `{ "title": "...", "description": "...", "priority": "high/medium/low" }` |
| **PUT** | `/tasks/:id` | Update task status | `{ "status": "pending/completed" }` |
| **DELETE** | `/tasks/:id` | Delete a task | *None* |

---

## 🎨 Features & UX Improvements (Bonus Implementations)

While building the core requirements, several enhancements were added to provide a professional, production-ready feel:

1. **Custom UI/UX Design System:** 
   - Removed reliance on basic browser alerts and default styles.
   - Built a sleek, custom-designed `ConfirmModal` for task deletion.
   - Used modern CSS variables, glassmorphism overlays, and smooth CSS animations (`slideIn`, `fadeIn`) for a premium user experience.
2. **Search & Filter Functionality:** 
   - Implemented real-time searching by task title and description.
   - Added quick filters (All / Active / Completed).
3. **Empty States & Loading Indicators:**
   - Visual feedback provided during API loading and when no tasks match a search query.
4. **Data Formatting:**
   - Human-readable timestamps (e.g., "about 2 hours ago") using `date-fns`.

---

## 💭 Assumptions & Future Improvements

**Assumptions:**
- **Database Choice:** SQLite was chosen to minimize setup friction for reviewers (no need to install MySQL/Postgres locally). The database is entirely self-contained.
- **Status Toggling:** The task status is currently a binary toggle (`pending` vs `completed`), keeping the workflow simple and intuitive.

**Future Improvements:**
- **Authentication:** Add JWT-based user authentication so different users can have private task lists.
- **Drag & Drop:** Implement a Kanban board view (e.g., using `dnd-kit`) to move tasks between columns.
- **Deployment:** The backend could be hosted on Render/Heroku and the frontend on Vercel/Netlify. (I have configured the frontend to use environment variables for the API URL, making deployment seamless).

---
*Developed for Effective Risk Management Pty Ltd.*
