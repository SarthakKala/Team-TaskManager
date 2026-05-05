const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  getTasksByProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/task.controller');

router.get('/project/:projectId', authenticate, getTasksByProject);
router.post('/', authenticate, requireAdmin, createTask);
router.put('/:id', authenticate, requireAdmin, updateTask);
router.patch('/:id/status', authenticate, updateTaskStatus);
router.delete('/:id', authenticate, requireAdmin, deleteTask);

module.exports = router;
