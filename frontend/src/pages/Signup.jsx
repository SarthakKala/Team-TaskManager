import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import api from '../api/axios.js';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 noise-bg">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-heading font-black text-5xl uppercase leading-none mb-1">
            JOIN THE<br />TEAM.
          </h1>
          <p className="font-mono text-sm text-gray-600">// create your account</p>
        </div>

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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="retro-input w-full border-2 border-black px-3 py-2 font-mono text-sm bg-paper focus:bg-white transition-colors"
              />
            </div>

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

            {/* Role Selection */}
            <div>
              <label className="block font-mono font-bold text-xs uppercase tracking-widest mb-2">
                Role
              </label>
              <div className="flex gap-3">
                {['MEMBER', 'ADMIN'].map((r) => (
                  <label
                    key={r}
                    className={`flex-1 flex items-center justify-center gap-2 border-2 border-black py-2 cursor-pointer font-mono font-bold text-sm transition-colors ${
                      form.role === r ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={form.role === r}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white font-heading font-black text-lg uppercase py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              style={{ boxShadow: '4px 4px 0px #555' }}
            >
              {loading ? 'CREATING...' : 'CREATE ACCOUNT ->'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-sm">
          Have an account?{' '}
          <Link to="/login" className="font-bold underline hover:no-underline">
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
}
