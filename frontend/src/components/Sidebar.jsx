import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 border-2 border-black font-mono font-bold text-sm tracking-wider transition-all ${
        isActive
          ? 'bg-black text-white'
          : 'bg-white text-black hover:bg-black hover:text-white'
      }`
    }
    style={{ boxShadow: '2px 2px 0px #000' }}
  >
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-paper border-r-2 border-black flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b-2 border-black">
        <h1 className="font-heading font-black text-2xl uppercase leading-none">
          TASK<br />
          <span className="text-4xl">MGR.</span>
        </h1>
        {isAdmin && (
          <span className="inline-block mt-2 border-2 border-black bg-black text-white text-xs font-mono font-bold px-2 py-0.5">
            ADMIN
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-3 p-4 flex-1">
        <NavItem to="/dashboard" label="DASHBOARD" />
        <NavItem to="/projects" label="PROJECTS" />
      </nav>

      {/* User Info */}
      <div className="p-4 border-t-2 border-black">
        <div
          className="border-2 border-black bg-white p-3 mb-3"
          style={{ boxShadow: '2px 2px 0px #000' }}
        >
          <p className="font-mono font-bold text-sm truncate">{user?.name}</p>
          <p className="font-mono text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full border-2 border-black bg-white text-black font-mono font-bold text-sm py-2 px-4 hover:bg-black hover:text-white transition-colors"
          style={{ boxShadow: '2px 2px 0px #000' }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
