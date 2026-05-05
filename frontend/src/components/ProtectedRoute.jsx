import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="border-2 border-black bg-white px-8 py-6" style={{ boxShadow: '4px 4px 0px #000' }}>
          <p className="font-mono font-bold text-lg tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
