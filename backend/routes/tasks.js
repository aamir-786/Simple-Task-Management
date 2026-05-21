const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// Get all tasks for the logged-in user
router.get('/', auth, (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new task for the logged-in user
router.post('/', auth, (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const sql = `INSERT INTO tasks (user_id, title, description, priority, status) VALUES (?, ?, ?, ?, 'pending')`;
  const params = [req.user.id, title, description || '', priority || 'medium'];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Return the newly created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});

// Update task status (must belong to user)
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { status, title, description, priority } = req.body;

  // Dynamic update query
  let updates = [];
  let params = [];

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (title) {
    updates.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (priority) {
    updates.push('priority = ?');
    params.push(priority);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(id, req.user.id);
  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      res.json(row);
    });
  });
});

// Delete a task (must belong to user)
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
  db.run(sql, [id, req.user.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task deleted successfully', id });
  });
});

module.exports = router;
