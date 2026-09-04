import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, ArrowLeft, AlertTriangle, ShieldCheck, Mail, Lock } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Login() {
  const [step, setStep] = useState('EMAIL'); // 'EMAIL' | 'OTP'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const { sendLoginOtp, verifyLoginOtp } = useAppStore();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (email.trim().length < 2) return;
    setLoading(true);
    setError('');

    try {
      const res = await sendLoginOtp(email.trim().toLowerCase(), password ? password.trim() : undefined);
      if (res.success) {
        if (res.requiresOtp) {
          setOtpMessage(res.message);
          setStep('OTP');
        } else {
          // Direct login (staff member or password authenticated)
          const user = useAppStore.getState().currentUser;
          if (user?.role === 'SuperAdmin' || user?.role === 'ShopAdmin') {
            navigate('/admin');
          } else if (user?.role === 'Delivery') {
            navigate('/delivery');
          } else {
            navigate('/shop-select');
          }
        }
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    const code = otpCode || otp.join('');
    if (code.length < 4) return;
    setLoading(true);
    setError('');

    try {
      const res = await verifyLoginOtp(email.trim().toLowerCase(), code);
      if (res.success) {
        const user = useAppStore.getState().currentUser;
        if (user?.role === 'SuperAdmin' || user?.role === 'ShopAdmin') {
          navigate('/admin');
        } else if (user?.role === 'Delivery') {
          navigate('/delivery');
        } else {
          navigate('/shop-select');
        }
      } else {
        setError(res.message || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`login-otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`login-otp-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      if (pasted.length === 6) {
        handleVerifyOTP(pasted);
      }
    }
  };

  const isEmailValid = email.trim().length >= 2;
  const isOtpValid = otp.join('').length === 6;

  return (
    <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit selection:bg-black selection:text-[#9AE600]">
      <div className="w-full max-w-md z-10 flex flex-col items-center">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
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
            <div className="mb-6 p-4 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black uppercase tracking-widest flex items-start gap-3">
              <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-widest bg-[#9AE600] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors">
                  <Mail size={20} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent border-none py-4 outline-none text-black font-black placeholder-gray-500 uppercase tracking-widest text-sm"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Optional Staff Password Toggle */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-black underline"
                  >
                    {showPassword ? 'Hide Staff Password' : 'Staff Member? Enter Password'}
                  </button>
                </div>

                {showPassword && (
                  <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors mt-2">
                    <Lock size={20} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ENTER STAFF PASSWORD"
                      className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-500 tracking-widest text-sm"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isEmailValid || loading}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest mt-6"
              >
                {loading ? 'SENDING OTP...' : (
                  <> {showPassword && password ? 'SIGN IN' : 'GET OTP'} <ArrowRight size={24} strokeWidth={4} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#9AE600] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-6">
                <ShieldCheck size={32} strokeWidth={3} className="text-black" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-black mb-2 lilita-one-regular tracking-wide uppercase">
                  Enter Verification Code
                </h2>
                <div className="flex flex-col items-center gap-1 bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <span className="font-black text-black tracking-wider text-xs">Sent via Resend to {email}</span>
                  <button
                    type="button"
                    onClick={() => { setStep('EMAIL'); setError(''); setOtp(['', '', '', '', '', '']); }}
                    className="text-[#0D8DE3] hover:text-black font-black text-xs uppercase tracking-widest underline mt-1"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              {otpMessage && (
                <p className="text-xs font-bold text-gray-600 text-center">{otpMessage}</p>
              )}

              {/* 6-digit OTP Input */}
              <div className="flex gap-2 justify-center my-2" onPaste={handleOtpPaste}>
                {otp.map((d, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black lilita-one-regular rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors focus:outline-none focus:-translate-y-1 ${
                      d ? 'bg-[#9AE600] text-black' : 'bg-gray-50 text-black'
                    }`}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOTP()}
                disabled={!isOtpValid || loading}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest"
              >
                {loading ? 'VERIFYING...' : (
                  <> VERIFY & LOGIN <ArrowRight size={24} strokeWidth={4} /></>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Resend Code
              </button>
            </div>
          )}
        </div>

        {/* Register Link */}
        {step === 'EMAIL' && (
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white px-6 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-black uppercase tracking-widest text-sm inline-flex items-center gap-2 transform rotate-1">
              New Customer?
              <Link
                to="/register"
                className="bg-[#9AE600] text-black border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-[#9AE600] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

