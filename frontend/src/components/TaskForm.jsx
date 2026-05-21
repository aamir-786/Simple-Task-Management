import React, { useState } from 'react';

function TaskForm({ onTaskAdded, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onTaskAdded({ title, description, priority });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-container">
      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input 
          type="text"   
          className="form-control" 
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <textarea 
          className="form-control" 
          placeholder="Add more details..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Priority</label>
        <select 
          className="form-control"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      
      <div className="modal-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
