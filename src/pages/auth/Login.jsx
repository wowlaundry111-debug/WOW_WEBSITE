import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (identifier.trim().length < 2) return;
    setLoading(true);
    setError('');

    try {
      const res = await login(identifier.trim(), password ? password.trim() : undefined);
      if (res.success) {
        const user = useAppStore.getState().currentUser;
        if (user?.role === 'SuperAdmin' || user?.role === 'ShopAdmin') {
          navigate('/admin');
        } else if (user?.role === 'Delivery') {
          navigate('/delivery');
        } else {
          navigate('/order');
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = identifier.trim().length >= 2;

  return (
    <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit selection:bg-black selection:text-[#B0FF49]">
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="bg-white border-2 border-black rounded-full p-2 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all mb-4 flex items-center justify-center w-28 h-28 overflow-hidden">
            <img src={logo} alt="WOW Laundry" className="w-26 h-26 object-contain scale-125" />
          </div>
          <h1 className="text-4xl font-extrabold text-black lilita-one-regular tracking-wide bg-white px-6 py-2 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2">
            WOW Laundry
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 w-full border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {error && (
            <div className="mb-6 p-4 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#B0FF49] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                User ID, Email, or Mobile
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ENTER ID, EMAIL, OR PHONE"
                className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-4 focus:outline-none focus:bg-[#B0FF49] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-black placeholder-gray-500 uppercase tracking-widest"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-yellow-300 inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD (OPTIONAL)"
                className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-4 focus:outline-none focus:bg-[#B0FF49] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-black placeholder-gray-500 tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest"
            >
              {loading ? (
                'SIGNING IN...'
              ) : (
                <>
                  SIGN IN <ArrowRight size={24} strokeWidth={4} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white px-6 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-black uppercase tracking-widest text-sm inline-flex items-center gap-2 transform rotate-1">
            No account?
            <Link
              to="/register"
              className="bg-[#B0FF49] text-black border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-[#B0FF49] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
