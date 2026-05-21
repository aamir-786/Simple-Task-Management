import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onTaskAdded({ title, description, priority });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsAdding(false);
  };

  return (
    <div className="card">
      <div className="card-header cursor-pointer" onClick={() => setIsAdding(!isAdding)}>
        <div className="card-title form-header-title">
          <Plus size={20} className={`transition-transform ${isAdding ? 'rotate-45' : ''}`} />
          {isAdding ? 'Cancel' : 'Create New Task'}
          
        </div>
      </div>
      
      {isAdding && (
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
            
            <button type="submit" className="btn btn-primary form-submit-btn">
              Save Task
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskForm;
