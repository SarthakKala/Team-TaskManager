import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Modal from '../components/Modal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import api from '../api/axios.js';
import useAuth from '../hooks/useAuth.js';

const STATUS_COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Task form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: '',
  });
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState('');

  // Member form
  const [memberForm, setMemberForm] = useState({ email: '', role: 'MEMBER' });
  const [memberSubmitting, setMemberSubmitting] = useState(false);
  const [memberError, setMemberError] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  };

  const handleTaskDelete = (taskId) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    setTaskSubmitting(true);

    try {
      const res = await api.post('/tasks', { ...taskForm, projectId: id });
      setProject((prev) => ({ ...prev, tasks: [res.data, ...prev.tasks] }));
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', dueDate: '', assignedToId: '' });
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    setMemberSubmitting(true);

    try {
      const res = await api.post(`/projects/${id}/members`, memberForm);
      setProject((prev) => ({ ...prev, members: [...prev.members, res.data] }));
      setShowMemberModal(false);
      setMemberForm({ email: '', role: 'MEMBER' });
    } catch (err) {
      setMemberError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setMemberSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      setProject((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== userId),
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const filteredTasks = project?.tasks?.filter(
    (t) => activeFilter === 'ALL' || t.status === activeFilter
  ) || [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="font-mono font-bold">LOADING PROJECT...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/projects')}
          className="font-mono text-sm font-bold mb-6 hover:underline flex items-center gap-1"
        >
          - BACK TO PROJECTS
        </button>

        {/* Project Header */}
        <div
          className="border-2 border-black bg-white p-6 mb-8"
          style={{ boxShadow: '4px 4px 0px #000' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-heading font-black text-4xl uppercase leading-none mb-2">
                {project.name}
              </h1>
              {project.description && (
                <p className="font-mono text-sm text-gray-600">{project.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-xs border-2 border-black px-2 py-1">
                {project.tasks?.length || 0} TASKS
              </span>
              <span className="font-mono text-xs border-2 border-black px-2 py-1">
                {project.members?.length || 0} MEMBERS
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Column (2/3 width) */}
          <div className="lg:col-span-2">
            {/* Tasks Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-black text-2xl uppercase">TASKS</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="border-2 border-black bg-black text-white font-mono font-bold text-xs px-4 py-2 hover:bg-white hover:text-black transition-colors"
                  style={{ boxShadow: '2px 2px 0px #555' }}
                >
                  + ADD TASK
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {['ALL', ...STATUS_COLUMNS].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`border-2 border-black font-mono font-bold text-xs px-3 py-1 transition-colors ${
                    activeFilter === status
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {status.replace('_', ' ')}
                  <span className="ml-1 opacity-60">
                    ({status === 'ALL'
                      ? project.tasks?.length || 0
                      : project.tasks?.filter((t) => t.status === status).length || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
              <div className="border-2 border-dashed border-black p-12 text-center">
                <p className="font-heading font-black text-2xl mb-1">NO TASKS.</p>
                <p className="font-mono text-xs text-gray-500">
                  {isAdmin ? 'Add tasks using the "+ ADD TASK" button.' : 'No tasks match this filter.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Members Column (1/3 width) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-black text-2xl uppercase">MEMBERS</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="border-2 border-black bg-white font-mono font-bold text-xs px-3 py-2 hover:bg-black hover:text-white transition-colors"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  + ADD
                </button>
              )}
            </div>

            <div
              className="border-2 border-black bg-white"
              style={{ boxShadow: '4px 4px 0px #000' }}
            >
              {project.members?.length === 0 ? (
                <p className="font-mono text-xs text-center text-gray-500 p-6">No members yet.</p>
              ) : (
                project.members.map((member, i) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i !== project.members.length - 1 ? 'border-b border-black' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-sm truncate">{member.user.name}</p>
                      <p className="font-mono text-xs text-gray-500 truncate">{member.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`border border-black font-mono text-xs px-1.5 py-0.5 ${
                        member.role === 'ADMIN' ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {member.role}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="border border-black font-mono text-xs w-6 h-6 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          X
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="ADD TASK">
        {taskError && (
          <div className="border-2 border-black bg-black text-white font-mono text-sm px-4 py-2 mb-4">
            Error: {taskError}
          </div>
        )}
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
              placeholder="e.g. Design landing page"
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Task details..."
              rows={2}
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper resize-none"
            />
          </div>
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Assign To
            </label>
            <select
              value={taskForm.assignedToId}
              onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
              className="w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper focus:outline-none"
            >
              <option value="">- Unassigned -</option>
              {project?.members?.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowTaskModal(false)}
              className="flex-1 border-2 border-black bg-white font-mono font-bold text-sm py-2 hover:bg-gray-100"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={taskSubmitting}
              className="flex-1 border-2 border-black bg-black text-white font-mono font-bold text-sm py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              style={{ boxShadow: '3px 3px 0px #555' }}
            >
              {taskSubmitting ? 'ADDING...' : 'ADD TASK ->'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="ADD MEMBER">
        {memberError && (
          <div className="border-2 border-black bg-black text-white font-mono text-sm px-4 py-2 mb-4">
            Error: {memberError}
          </div>
        )}
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Member Email *
            </label>
            <input
              type="email"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              required
              placeholder="member@example.com"
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-2">
              Role in Project
            </label>
            <div className="flex gap-3">
              {['MEMBER', 'ADMIN'].map((r) => (
                <label
                  key={r}
                  className={`flex-1 flex items-center justify-center gap-2 border-2 border-black py-2 cursor-pointer font-mono font-bold text-sm transition-colors ${
                    memberForm.role === r ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="memberRole"
                    value={r}
                    checked={memberForm.role === r}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="hidden"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowMemberModal(false)}
              className="flex-1 border-2 border-black bg-white font-mono font-bold text-sm py-2 hover:bg-gray-100"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={memberSubmitting}
              className="flex-1 border-2 border-black bg-black text-white font-mono font-bold text-sm py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              style={{ boxShadow: '3px 3px 0px #555' }}
            >
              {memberSubmitting ? 'ADDING...' : 'ADD ->'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
