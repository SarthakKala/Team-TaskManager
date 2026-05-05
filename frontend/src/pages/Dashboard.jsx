import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value }) => (
  <div
    className="retro-card border-2 border-black bg-white p-5"
    style={{ boxShadow: '4px 4px 0px #000' }}
  >
    <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className="font-heading font-black text-5xl">{value}</p>
  </div>
);

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-1">
            // welcome back
          </p>
          <h1 className="font-heading font-black text-4xl uppercase leading-none">
            {user?.name?.split(' ')[0]}.
          </h1>
        </div>

        {loading ? (
          <p className="font-mono text-sm">LOADING DATA...</p>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              <StatCard label="Total Tasks" value={data?.stats?.total ?? 0} />
              <StatCard label="Done" value={data?.stats?.done ?? 0} />
              <StatCard label="In Progress" value={data?.stats?.inProgress ?? 0} />
              <StatCard label="Overdue" value={data?.stats?.overdue ?? 0} />
              <StatCard label={isAdmin ? 'Projects' : 'My Projects'} value={data?.stats?.projectCount ?? 0} />
            </div>

            {/* Divider */}
            <div className="border-t-2 border-black mb-6 flex items-center gap-4">
              <h2 className="font-heading font-black text-xl uppercase bg-paper pr-4 -mt-3">
                RECENT TASKS
              </h2>
            </div>

            {/* Recent Tasks Table */}
            {data?.recentTasks?.length === 0 ? (
              <div
                className="border-2 border-dashed border-black p-12 text-center"
              >
                <p className="font-heading font-black text-2xl">NO TASKS YET.</p>
                <p className="font-mono text-sm text-gray-500 mt-2">
                  {isAdmin ? 'Create a project and add tasks to get started.' : 'Ask your admin to assign tasks to you.'}
                </p>
              </div>
            ) : (
              <div
                className="border-2 border-black bg-white"
                style={{ boxShadow: '4px 4px 0px #000' }}
              >
                {/* Table Header */}
                <div className="grid grid-cols-12 border-b-2 border-black bg-black text-white px-4 py-2">
                  <span className="col-span-4 font-mono font-bold text-xs uppercase tracking-wider">Task</span>
                  <span className="col-span-3 font-mono font-bold text-xs uppercase tracking-wider">Project</span>
                  <span className="col-span-2 font-mono font-bold text-xs uppercase tracking-wider">Assignee</span>
                  <span className="col-span-2 font-mono font-bold text-xs uppercase tracking-wider">Status</span>
                  <span className="col-span-1 font-mono font-bold text-xs uppercase tracking-wider">Date</span>
                </div>

                {data?.recentTasks?.map((task, i) => (
                  <div
                    key={task.id}
                    className={`grid grid-cols-12 px-4 py-3 items-center cursor-pointer hover:bg-paper transition-colors ${
                      i !== data.recentTasks.length - 1 ? 'border-b border-black' : ''
                    }`}
                    onClick={() => navigate(`/projects/${task.project.id}`)}
                  >
                    <span className="col-span-4 font-mono text-sm font-bold truncate pr-2">{task.title}</span>
                    <span className="col-span-3 font-mono text-xs text-gray-600 truncate pr-2">{task.project?.name}</span>
                    <span className="col-span-2 font-mono text-xs text-gray-600 truncate pr-2">{task.assignedTo?.name || '-'}</span>
                    <span className="col-span-2"><StatusBadge status={task.status} /></span>
                    <span className="col-span-1 font-mono text-xs text-gray-500">{formatDate(task.updatedAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
