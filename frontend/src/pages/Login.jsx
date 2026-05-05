import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import api from '../api/axios.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 noise-bg relative">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-black text-5xl uppercase leading-none mb-1 text-black">
            SIGN IN.
          </h1>
          <p className="font-mono text-sm text-black">// access your workspace</p>
        </div>

        {/* Card */}
        <div
          className="border-2 border-black bg-white p-8"
          style={{ boxShadow: '6px 6px 0px #000' }}
        >
          {error && (
            <div className="border-2 border-black bg-black text-white font-mono text-sm px-4 py-3 mb-6">
              Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white font-heading font-black text-lg uppercase py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              style={{ boxShadow: '4px 4px 0px #555' }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN ->'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-sm text-black">
          No account?{' '}
          <Link to="/signup" className="font-bold underline hover:no-underline text-black">
            CREATE ONE
          </Link>
        </p>
      </div>
    </div>
  );
}
