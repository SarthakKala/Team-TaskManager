const prisma = require('../lib/prisma');

const getDashboard = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const taskWhere = isAdmin ? {} : { assignedToId: req.user.id };

    const [total, done, inProgress, overdue, todo, recentTasks, projectCount] = await Promise.all([
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: 'DONE' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'OVERDUE' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'TODO' } }),
      prisma.task.findMany({
        where: taskWhere,
        take: 6,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      isAdmin
        ? prisma.project.count()
        : prisma.projectMember.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      stats: { total, done, inProgress, overdue, todo, projectCount },
      recentTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboard };
