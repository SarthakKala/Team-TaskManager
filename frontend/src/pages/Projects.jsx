import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Modal from '../components/Modal.jsx';
import api from '../api/axios.js';
import useAuth from '../hooks/useAuth.js';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/projects', form);
      setProjects([res.data, ...projects]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-1">
              // all projects
            </p>
            <h1 className="font-heading font-black text-4xl uppercase leading-none">PROJECTS.</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="border-2 border-black bg-black text-white font-mono font-bold text-sm px-5 py-2.5 hover:bg-white hover:text-black transition-colors"
              style={{ boxShadow: '3px 3px 0px #555' }}
            >
              + NEW PROJECT
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <p className="font-mono text-sm">LOADING PROJECTS...</p>
        ) : projects.length === 0 ? (
          <div className="border-2 border-dashed border-black p-16 text-center">
            <p className="font-heading font-black text-3xl mb-2">NO PROJECTS YET.</p>
            <p className="font-mono text-sm text-gray-500">
              {isAdmin ? 'Click "+ NEW PROJECT" to get started.' : 'You have not been added to any projects yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="NEW PROJECT">
        {error && (
          <div className="border-2 border-black bg-black text-white font-mono text-sm px-4 py-2 mb-4">
            Error: {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Mobile App Redesign"
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..."
              rows={3}
              className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 border-2 border-black bg-white font-mono font-bold text-sm py-2 hover:bg-gray-100 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 border-2 border-black bg-black text-white font-mono font-bold text-sm py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              style={{ boxShadow: '3px 3px 0px #555' }}
            >
              {submitting ? 'CREATING...' : 'CREATE ->'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
