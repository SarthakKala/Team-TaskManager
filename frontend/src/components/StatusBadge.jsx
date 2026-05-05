const configs = {
  TODO: {
    label: 'TODO',
    className: 'bg-white text-black border-2 border-black',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    className: 'bg-black text-white border-2 border-black',
  },
  DONE: {
    label: 'DONE',
    className: 'bg-white text-black border-2 border-black',
  },
  OVERDUE: {
    label: 'OVERDUE',
    className: 'bg-black text-white border-2 border-black',
  },
};

export default function StatusBadge({ status }) {
  const config = configs[status] || configs.TODO;
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono font-bold tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
