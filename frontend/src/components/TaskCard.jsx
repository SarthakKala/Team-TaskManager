import StatusBadge from './StatusBadge.jsx';
import useAuth from '../hooks/useAuth.js';
import api from '../api/axios.js';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'];

export default function TaskCard({ task, onUpdate, onDelete }) {
  const { isAdmin, user } = useAuth();
  const canEditStatus = task.assignedTo?.id === user?.id;

  const handleStatusChange = async (e) => {
    try {
      const res = await api.patch(`/tasks/${task.id}/status`, { status: e.target.value });
      onUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      onDelete(task.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="retro-card border-2 border-black bg-white p-4"
      style={{ boxShadow: '4px 4px 0px #000' }}
    >
      {/* Title & Status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-heading font-bold text-base leading-tight">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="font-mono text-xs text-gray-600 mb-3 leading-relaxed">{task.description}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs font-mono mb-3">
        {task.assignedTo && (
          <span className="border border-black px-2 py-0.5">
            Assignee: {task.assignedTo.name}
          </span>
        )}
        {task.dueDate && (
          <span className="border border-black px-2 py-0.5">
            Due: {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-black">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={!canEditStatus}
          className="flex-1 border-2 border-black bg-paper font-mono text-xs py-1 px-2 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        {!canEditStatus && (
          <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap">
            assignee only
          </span>
        )}
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="border-2 border-black bg-white text-black font-mono text-xs px-2 py-1 hover:bg-black hover:text-white transition-colors"
          >
            DEL
          </button>
        )}
      </div>
    </div>
  );
}
