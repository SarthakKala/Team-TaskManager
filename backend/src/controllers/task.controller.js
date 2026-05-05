const prisma = require('../lib/prisma');

const getTasksByProject = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, description, dueDate, projectId, assignedToId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ message: 'Title and projectId are required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId: assignedToId || null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, dueDate, assignedToId, status } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assignedToId !== undefined && { assignedToId }),
        ...(status && { status }),
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, updateTaskStatus, deleteTask };
