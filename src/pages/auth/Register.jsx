import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle, Info, ShieldCheck } from 'lucide-react';
import logo from '../../assets/logo.webp';
import { useAppStore } from '../../store/useAppStore';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    phone: '',
    password: '',
  });
  const [redirectNotice] = useState(
    location.state?.redirectedFromLogin ? 'No account found with this email. Please register below to continue!' : ''
  );
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  const { register, verifyOtp } = useAppStore();

  // Step 1 — Submit form, backend sends OTP
  const handleRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setLoading(true);
    setError('');

    const res = await register(
      formData.name.trim(),
      formData.phone.trim(),
      formData.email.trim().toLowerCase(),
      formData.password ? formData.password.trim() : undefined
    );
    setLoading(false);

    if (res.success && res.requiresOtp) {
      setOtpMessage(res.message);
      setStep('otp');
    } else if (res.success) {
      // Account created directly (no OTP needed — fallback)
      navigate('/shop-select');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  // Step 2 — Submit OTP
  const handleVerifyOtp = async (otpCode) => {
    const code = typeof otpCode === 'string' ? otpCode : otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    setError('');

    const res = await verifyOtp(formData.email.trim().toLowerCase(), code);
    setLoading(false);

    if (res.success) {
      navigate('/shop-select');
    } else {
      setError(res.message || 'Invalid verification code');
    }
  };

  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[idx] = clean ? clean.slice(-1) : '';
    setOtp(newOtp);

    if (clean && idx < 5) {
      const nextInput = document.getElementById(`register-otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const prevInput = document.getElementById(`register-otp-${idx - 1}`);
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
        handleVerifyOtp(pasted);
      }
    }
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.email.includes('@') &&
    formData.phone.replace(/[^0-9]/g, '').length === 10;
  const isOtpValid = otp.join('').length === 6;

  return (
    <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit selection:bg-black selection:text-[#9AE600]">
      <div className="w-full max-w-md z-10 flex flex-col items-center">

        {/* Back Button */}
        <div className="w-full mb-4 flex justify-start">
          {step === 'otp' ? (
            <button
              onClick={() => { setStep('form'); setError(''); setOtp(''); }}
              className="bg-white border-2 border-black p-2.5 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              <ArrowLeft size={22} strokeWidth={3} />
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white border-2 border-black p-2.5 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              <ArrowLeft size={22} strokeWidth={3} />
            </Link>
          )}
        </div>

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center animate-fade-in-up">
          <div className="bg-white border-2 border-black rounded-full p-2 shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-3 flex items-center justify-center w-24 h-24 overflow-hidden">
            <img src={logo} alt="WOW Laundry" className="object-contain scale-125" />
          </div>
          <h1 className="text-3xl font-extrabold text-black lilita-one-regular tracking-wide bg-white px-6 py-1.5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2">
            {step === 'form' ? 'Create Account' : 'Verify Email'}
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 w-full border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up">

          {redirectNotice && !error && (
            <div className="mb-5 p-4 bg-[#9AE600] text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-bold flex items-start gap-3">
              <Info size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <span>{redirectNotice}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black tracking-widest flex items-start gap-3">
              <AlertTriangle size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" />
              <span>
                {error}
                {error.toLowerCase().includes('already exists') && (
                  <> — <Link to="/login" className="underline">Sign In</Link></>
                )}
              </span>
            </div>
          )}

          {/* ── Step 1: Registration Form ── */}
          {step === 'form' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#9AE600] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                  Full Name
                </label>
                <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors">
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

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#9AE600] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors">
                  <Mail size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="NAME@EXAMPLE.COM"
                    className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-[#9AE600] inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-1">
                  Phone Number
                </label>
                <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors">
                  <Phone size={18} strokeWidth={2.5} className="text-black mr-2.5 shrink-0" />
                  <div className="border-r-2 border-black pr-2.5 mr-2.5 text-black font-black text-sm">+91</div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full bg-transparent border-none py-3.5 outline-none text-black font-black placeholder-gray-400 tracking-wider text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-widest bg-yellow-300 inline-block px-2 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                  Password (Optional)
                </label>
                <div className="flex items-center bg-gray-50 border-2 border-black rounded-xl px-3.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-within:bg-[#9AE600] transition-colors">
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
                {loading ? 'SENDING OTP...' : <> SEND OTP <ArrowRight size={22} strokeWidth={3.5} /></>}
              </button>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === 'otp' && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#9AE600] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-6">
                <ShieldCheck size={32} strokeWidth={3} className="text-black" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-black mb-2 lilita-one-regular tracking-wide uppercase">
                  Enter Verification Code
                </h2>
                <div className="flex flex-col items-center gap-1 bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <span className="font-black text-black tracking-wider text-xs">Sent via Resend to {formData.email}</span>
                  <button
                    type="button"
                    onClick={() => { setStep('form'); setError(''); setOtp(['', '', '', '', '', '']); }}
                    className="text-[#0D8DE3] hover:text-black font-black text-xs uppercase tracking-widest underline mt-1"
                  >
                    Change Details
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
                    id={`register-otp-${idx}`}
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
                onClick={() => handleVerifyOtp()}
                disabled={!isOtpValid || loading}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none text-xl uppercase tracking-widest"
              >
                {loading ? 'VERIFYING...' : (
                  <> VERIFY & CREATE ACCOUNT <ArrowRight size={24} strokeWidth={4} /></>
                )}
              </button>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                Resend Code
              </button>
            </div>
          )}
        </div>

        {/* Sign In link */}
        <div className="mt-6 text-center animate-fade-in-up">
          <div className="bg-white px-6 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black text-black uppercase tracking-widest text-sm inline-flex items-center gap-2 transform rotate-1">
            Already have an account?
            <Link to="/login" className="bg-[#9AE600] text-black border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-[#9AE600] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
