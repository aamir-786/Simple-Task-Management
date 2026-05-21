const API_URL = 'http://localhost:5000/api/tasks';

export const fetchTasksAPI = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTaskAPI = async (taskData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

export const updateTaskStatusAPI = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const deleteTaskAPI = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
};
