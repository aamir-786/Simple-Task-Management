import React from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

function TaskCard({ task, onToggleStatus, onDelete }) {
  const isCompleted = task.status === 'completed';
  const dateStr = task.created_at ? new Date(task.created_at) : new Date();

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div 
        className="custom-checkbox" 
        onClick={() => onToggleStatus(task.id, task.status)}
      >
        <Check size={14} strokeWidth={4} />
      </div>
      
      <div className="task-content">
        <div className="task-title">
          {task.title}
          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <div className="task-desc">
            {task.description}
          </div>
        )}
        
        <div className="task-meta">
          <span className="task-date" title={format(dateStr, 'PPpp')}>
            <Clock size={14} />
            {formatDistanceToNow(dateStr, { addSuffix: true })}
          </span>
          <span className={`badge badge-${task.status}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          className="btn-icon danger" 
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
