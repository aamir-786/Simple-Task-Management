import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, LogOut, CheckCircle2, Plus } from 'lucide-react';

import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ConfirmModal from './components/ConfirmModal';
import AuthForm from './components/AuthForm';
import { fetchTasksAPI, createTaskAPI, updateTaskStatusAPI, deleteTaskAPI } from './api';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search State
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasksAPI();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTaskAPI(taskData);
      setTasks([newTask, ...tasks]);
      setIsAddTaskModalOpen(false); // Close modal on success
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      const updatedTask = await updateTaskStatusAPI(id, newStatus);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      alert(err.message);
      loadTasks();
    }
  };

  const handleDeleteTask = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTaskAPI(taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <div className="logo-icon-small">
            <CheckCircle2 size={24} color="#fff" />
          </div>
          <h1>TaskFlow</h1>
        </div>
        
        <div className="navbar-search">
          <div className="search-container-nav">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              className="search-input-nav"
              placeholder="Search your tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-greeting">
            <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user?.name || user?.username.split('@')[0]}</span>
          </div>
          <button onClick={handleLogout} className="btn-icon-logout" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-titles">
            <h2>My Tasks</h2>
            <p>You have {tasks.filter(t => t.status === 'pending').length} active tasks remaining.</p>
          </div>
          <div className="dashboard-controls">
            <div className="glass-pills">
              <button 
                className={`pill-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`pill-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Active
              </button>
              <button 
                className={`pill-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            <button className="btn-primary-glass shadow-hover" onClick={() => setIsAddTaskModalOpen(true)}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loader">
            <AlertCircle className="animate-spin" size={32} />
            <span className="loading-text">Loading your workspace...</span>
          </div>
        ) : error ? (
          <div className="error-card glass-panel">
            <AlertCircle size={32} className="error-icon" />
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadTasks}>Retry</button>
          </div>
        ) : (
          <div className="task-grid-container">
            <TaskList 
              tasks={filteredTasks} 
              onToggleStatus={handleToggleStatus} 
              onDelete={handleDeleteTask}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile/Tablet) */}
      <button className="fab-button" onClick={() => setIsAddTaskModalOpen(true)}>
        <Plus size={24} color="white" />
      </button>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-thick">
            <div className="modal-header-clean">
              <h3 className="modal-title">Create New Task</h3>
              <p className="modal-subtitle">What do you need to get done?</p>
            </div>
            <TaskForm 
              onTaskAdded={handleAddTask} 
              onCancel={() => setIsAddTaskModalOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
      />
    </div>
  );
}

export default App;
