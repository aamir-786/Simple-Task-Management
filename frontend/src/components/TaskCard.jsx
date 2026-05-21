import React from 'react';
import { Check, Trash2, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

function TaskCard({ task, onToggleStatus, onDelete }) {
  const isCompleted = task.status === 'completed';
  const dateStr = task.created_at ? new Date(task.created_at) : new Date();

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header-card">
        <div 
          className="custom-checkbox" 
          onClick={() => onToggleStatus(task.id, task.status)}
        >
          <Check size={16} strokeWidth={4} />
        </div>
        
        <div className="task-title-group">
          <div className="task-title">
            {task.title}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span className={`badge badge-${task.priority}`}>
              {task.priority}
            </span>
            <span className={`badge badge-${task.status}`}>
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
      
      {task.description && (
        <div className="task-desc">
          {task.description}
        </div>
      )}
      
      <div className="task-footer-card">
        <span className="task-date" title={format(dateStr, 'PPpp')} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
          <Clock size={14} />
          {formatDistanceToNow(dateStr, { addSuffix: true })}
        </span>
        
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
    </div>
  );
}

export default TaskCard;
