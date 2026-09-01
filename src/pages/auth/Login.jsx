import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import logo from '../../assets/logo.png';
import api, { setAuthToken } from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState('EMAIL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (email.length < 3) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      const data = response.data;
      
      // Staff Direct Login (No OTP needed for SuperAdmin, ShopAdmin, Delivery)
      if (data.directLogin && data.token && data.user) {
        setAuthToken(data.token);
        useAppStore.setState({
          currentUser: data.user,
          currentRole: data.user.role,
          currentTenantId: data.user.role === 'SuperAdmin' ? '' : (data.user.shopId || ''),
        });
        useAppStore.getState().fetchCatalog();
        useAppStore.getState().fetchOrders();
        
        if (['SuperAdmin', 'ShopAdmin'].includes(data.user.role)) {
          useAppStore.getState().fetchUsers();
          navigate('/admin');
        } else if (data.user.role === 'Delivery') {
          navigate('/delivery');
        } else {
          navigate('/order');
        }
        return;
      }

      if (data.autoLogin) {
        handleVerifyOTP(data.mockOtp);
      } else {
        setStep('OTP');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    setLoading(true);
    setError('');
    const res = await login(email.trim().toLowerCase(), otpCode || otp.join(''));
    setLoading(false);
    
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
      setError(res.message);
    }
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const isEmailValid = email.length >= 3;
  const isOtpValid = otp.join('').length === 4;

  return (
    <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit selection:bg-black selection:text-[#B0FF49]">
      
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="bg-white border-2 border-black rounded-full p-2 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all mb-4">
            <img src={logo} alt="WOW Laundry" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold text-black lilita-one-regular tracking-wide bg-white px-6 py-2 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2">WOW Laundry</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 w-full border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#B0FF49] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">User ID or Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER ID OR EMAIL"
                  className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-4 focus:outline-none focus:bg-[#B0FF49] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-black placeholder-gray-500 uppercase tracking-widest"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!isEmailValid || loading}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest"
              >
                {loading ? 'WAIT...' : (
                  <>CONTINUE <ArrowRight size={24} strokeWidth={4} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#B0FF49] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-2 transform rotate-12">
                <ShieldCheck size={32} strokeWidth={3} className="text-black" />
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-black text-black mb-2 lilita-one-regular tracking-wide uppercase">Enter OTP</h2>
                <div className="flex flex-col items-center gap-1 bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <span className="font-black text-black uppercase tracking-widest text-xs">Sent to {email}</span>
                  <button onClick={() => setStep('EMAIL')} className="text-[#0D8DE3] hover:text-black font-black text-xs uppercase tracking-widest bg-black px-2 py-0.5 rounded">Change</button>
                </div>
              </div>

              <div className="flex gap-3 justify-center my-6">
                {otp.map((d, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className={`w-14 h-16 sm:w-16 sm:h-16 text-center text-3xl font-black lilita-one-regular rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors focus:outline-none focus:-translate-y-1 ${d ? 'bg-[#B0FF49] text-black' : 'bg-gray-50 text-black'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerifyOTP()}
                disabled={!isOtpValid || loading}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest"
              >
                {loading ? 'WAIT...' : (
                  <>VERIFY & LOGIN <ArrowRight size={24} strokeWidth={4} /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Register Link */}
        {step === 'EMAIL' && (
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white px-6 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-black uppercase tracking-widest text-sm inline-flex items-center gap-2 transform rotate-1">
              No account? 
              <Link to="/register" className="bg-[#B0FF49] text-black border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-[#B0FF49] transition-colors">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
