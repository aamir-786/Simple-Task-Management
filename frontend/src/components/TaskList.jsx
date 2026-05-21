import React from 'react';
import { Search, ListTodo } from 'lucide-react';
import TaskCard from './TaskCard';

function TaskList({ tasks, onToggleStatus, onDelete, searchQuery }) {
  if (tasks.length === 0) {
    return (
      <div className="card">
        <div className="card-body empty-state">
          {searchQuery ? (
            <>
              <Search size={48} />
              <h3>No matching tasks found</h3>
              <p>Try adjusting your search or filters</p>
            </>
          ) : (
            <>
              <ListTodo size={48} />
              <h3>No tasks yet</h3>
              <p>Add a task above to get started</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onToggleStatus={onToggleStatus} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

export default TaskList;
