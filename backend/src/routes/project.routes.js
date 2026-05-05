const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');

router.get('/', authenticate, getProjects);
router.post('/', authenticate, requireAdmin, createProject);
router.get('/:id', authenticate, getProject);
router.put('/:id', authenticate, requireAdmin, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);
router.post('/:id/members', authenticate, requireAdmin, addMember);
router.delete('/:id/members/:userId', authenticate, requireAdmin, removeMember);

module.exports = router;
