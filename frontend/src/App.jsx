import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, LogOut, CheckCircle2 } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTaskAPI(taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setIsModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
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
    <div className="container">
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-icon">
            <CheckCircle2 size={24} color="#fff" />
          </div>
          <div>
            <h1>Task Flow</h1>
            <p>Welcome back, <span className="highlight">{user?.name || user?.username.split('@')[0]}</span></p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="btn-logout" title="Sign Out">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      <TaskForm onTaskAdded={handleAddTask} />

      <div className="controls">
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            className="form-control search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader">
          <AlertCircle className="animate-spin" />
          <span className="loading-text">Loading tasks...</span>
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-body error-container">
            <AlertCircle size={24} className="error-icon" />
            <p>Error: {error}</p>
            <button className="btn btn-primary error-btn" onClick={loadTasks}>Try Again</button>
          </div>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onToggleStatus={handleToggleStatus} 
          onDelete={handleDeleteTask}
          searchQuery={searchQuery}
        />
      )}

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}

export default App;
