import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black w-full max-w-md"
        style={{ boxShadow: '6px 6px 0px #000' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b-2 border-black px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading font-black text-xl uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="border-2 border-black w-8 h-8 flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors"
          >
            X
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
