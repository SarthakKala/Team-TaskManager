import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="retro-card border-2 border-black bg-white p-5 cursor-pointer"
      style={{ boxShadow: '4px 4px 0px #000' }}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Browser-tab style header */}
      <div className="flex items-center gap-1.5 mb-4 pb-3 border-b-2 border-black">
        <span className="w-2.5 h-2.5 rounded-full border border-black bg-white inline-block" />
        <span className="w-2.5 h-2.5 rounded-full border border-black bg-gray-400 inline-block" />
        <span className="font-mono text-xs text-gray-500 ml-2 truncate">{project.id.slice(0, 16)}...</span>
      </div>

      <h2 className="font-heading font-black text-xl uppercase mb-1 leading-tight">{project.name}</h2>

      {project.description && (
        <p className="font-mono text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-dashed border-black">
        <span className="font-mono text-xs">
          Members: {project.members?.length || 0}
        </span>
        <span className="font-mono text-xs border-2 border-black px-2 py-0.5">
          {project._count?.tasks || 0} tasks
        </span>
      </div>

      <div className="mt-3">
        <span className="font-mono text-xs font-bold hover:underline">
            VIEW PROJECT
        </span>
      </div>
    </div>
  );
}
