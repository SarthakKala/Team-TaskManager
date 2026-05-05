import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-8 noise-bg">
      <div
        className="border-2 border-black bg-white p-12 text-center max-w-md w-full"
        style={{ boxShadow: '8px 8px 0px #000' }}
      >
        <p className="font-mono text-xs tracking-widest text-gray-500 mb-2">// error</p>
        <h1 className="font-heading font-black text-9xl leading-none mb-4">404</h1>
        <div className="border-t-2 border-b-2 border-black py-4 my-4">
          <p className="font-mono font-bold text-sm">PAGE NOT FOUND.</p>
          <p className="font-mono text-xs text-gray-500 mt-1">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="border-2 border-black bg-black text-white font-mono font-bold text-sm px-6 py-3 hover:bg-white hover:text-black transition-colors"
          style={{ boxShadow: '3px 3px 0px #555' }}
        >
          -GO HOME
        </button>
      </div>
    </div>
  );
}
