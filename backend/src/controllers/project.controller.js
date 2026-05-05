const prisma = require('../lib/prisma');

const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: req.user.id } } },
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        createdById: req.user.id,
        members: {
          create: { userId: req.user.id, role: 'ADMIN' },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

const updateProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description },
    });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

const addMember = async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Member email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: req.params.id,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(member);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to add member' });
  }
};

const removeMember = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: { userId, projectId: req.params.id },
      },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
