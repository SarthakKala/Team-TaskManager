import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('ttm-theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('ttm-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDark((prev) => !prev)}
        className="fixed top-4 right-4 z-[100] border-2 border-black bg-white text-black px-3 py-1.5 font-mono text-xs font-bold tracking-wide hover:bg-black hover:text-white transition-colors"
        style={{ boxShadow: '2px 2px 0px #000' }}
      >
        {isDark ? 'SUN' : 'MOON'}
      </button>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
