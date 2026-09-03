import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useAppStore } from '../../store/useAppStore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAppStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setLoading(true);
    setError('');

    try {
      const res = await register(
        formData.name.trim(),
        formData.phone.trim(),
        formData.email.trim().toLowerCase(),
        formData.password ? formData.password.trim() : undefined
      );

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
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.email.includes('@') &&
    formData.phone.replace(/[^0-9]/g, '').length === 10;

  return (
    <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit selection:bg-black selection:text-[#B0FF49]">
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full mb-4 flex justify-start">
          <Link
            to="/login"
            className="bg-white border-2 border-black p-2.5 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center text-black"
          >
            <ArrowLeft size={22} strokeWidth={3} />
          </Link>
        </div>

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="bg-white border-2 border-black rounded-full p-2 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all mb-3 flex items-center justify-center w-24 h-24 overflow-hidden">
            <img src={logo} alt="WOW Laundry" className="w-22 h-22 object-contain scale-125" />
          </div>
          <h1 className="text-3xl font-extrabold text-black lilita-one-regular tracking-wide bg-white px-6 py-1.5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2">
            Create Account
          </h1>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8 w-full border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#B0FF49] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                Full Name
              </label>
              <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#B0FF49] transition-colors">
                <User size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="JOHN DOE"
                  className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 uppercase tracking-wider text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#B0FF49] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                Email Address
              </label>
              <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#B0FF49] transition-colors">
                <Mail size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="NAME@EXAMPLE.COM"
                  className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 uppercase tracking-wider text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#B0FF49] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                Phone Number
              </label>
              <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#B0FF49] transition-colors">
                <Phone size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                <div className="border-r-2 border-black pr-2.5 mr-2.5 text-black font-black text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 tracking-wider text-sm"
                  required
                />
              </div>
            </div>

            {/* Password (Optional) */}
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-yellow-300 inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                Password (Optional)
              </label>
              <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#B0FF49] transition-colors">
                <Lock size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="CREATE PASSWORD (OPTIONAL)"
                  className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 tracking-wider text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest mt-6"
            >
              {loading ? (
                'CREATING ACCOUNT...'
              ) : (
                <>
                  SIGN UP & ENTER <ArrowRight size={22} strokeWidth={3.5} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing account footer */}
        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white px-6 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-black uppercase tracking-widest text-sm inline-flex items-center gap-2 transform rotate-1">
            Already have an account?
            <Link
              to="/login"
              className="bg-[#B0FF49] text-black border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-[#B0FF49] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
