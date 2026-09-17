import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Store, X, Phone, Mail, Shield } from 'lucide-react';
import logo from '../assets/logo.webp';
import { setAuthToken } from '../services/api';
import { sortShopsWithLpuFirst } from '../utils/branchHelper';

export default function Navbar() {
  const { currentUser, setCurrentUser, cart, shops, currentTenantId, setCurrentTenantId } = useAppStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore storage errors
    }
    setShowMenu(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'SuperAdmin' || currentUser.role === 'ShopAdmin') return '/admin';
    if (currentUser.role === 'Delivery') return '/delivery';
    return '/order-history';
  };

  const sortedShops = sortShopsWithLpuFirst(shops);
  const activeShopId = currentTenantId || (sortedShops.length > 0 ? sortedShops[0]._id : '');

  return (
    <nav className="bg-[#9AE600] border-b-2 border-black sticky top-0 z-50 shadow-[0_4px_0_rgba(0,0,0,1)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-3 transition-colors">
              <div className="bg-black border-2 sm:border-3 border-black rounded-full shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 overflow-hidden shrink-0">
                <img src={logo} alt="" width="72" height="72" className="w-16 h-16 sm:w-22 sm:h-22 object-contain scale-125" />
              </div>
              <span className="font-extrabold text-2xl sm:text-4xl text-black lilita-one-regular uppercase tracking-wider bg-white px-3 py-0.5 sm:px-4 sm:py-1 border-2 sm:border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-xl sm:rounded-2xl transform -rotate-2">
                WOW Laundry
              </span>
            </Link>

            {/* Shop Switcher Dropdown */}
            {sortedShops.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Store size={16} strokeWidth={2.5} className="text-[#0D8DE3]" />
                <select
                  value={activeShopId}
                  onChange={(e) => setCurrentTenantId(e.target.value)}
                  className="bg-transparent font-black text-xs uppercase tracking-wider text-black cursor-pointer focus:outline-none"
                  title="Select Shop Branch"
                >
                  {sortedShops.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>



          <div className="flex items-center gap-4 sm:gap-6">
            {(!currentUser || currentUser.role === 'Customer') && (
              <Link to="/order" className="text-black hover:text-[#0D8DE3] font-black text-sm uppercase tracking-widest hidden sm:block transition-colors">
                Services
              </Link>
            )}

            {(!currentUser || currentUser.role === 'Customer') && (
              <Link to="/cart" aria-label={`Shopping Cart${cartItemsCount > 0 ? `, ${cartItemsCount} items` : ''}`} className="relative p-1.5 bg-white border-2 border-black rounded-xl text-black hover:bg-black hover:text-[#9AE600] shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors">
                <ShoppingCart size={20} strokeWidth={3} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-3 -right-3 inline-flex items-center justify-center w-7 h-7 text-sm font-black text-white bg-[#0D8DE3] border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-3 bg-white border-2 border-black rounded-full py-1.5 px-3 hover:bg-gray-100 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-[#9AE600] text-sm font-black border-2 border-black">
                    {currentUser.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-base font-black text-black uppercase tracking-widest hidden sm:block">{currentUser.name}</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] py-3 border-2 border-black z-50">
                    <div className="px-5 py-3 border-b-2 border-black mb-2 bg-[#0D8DE3] -mt-3 rounded-t-xl text-white">
                      <p className="text-sm font-black truncate uppercase tracking-widest">{currentUser.name}</p>
                      <p className="text-xs font-bold truncate opacity-90">{currentUser.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setShowProfileModal(true); setShowMenu(false); }}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm font-black text-black hover:bg-[#9AE600] hover:border-y-4 hover:border-black uppercase tracking-widest transition-colors"
                    >
                      <User size={20} strokeWidth={3} /> My Profile
                    </button>

                    <Link 
                      to={getDashboardLink()} 
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-black text-black hover:bg-[#9AE600] hover:border-y-4 hover:border-black uppercase tracking-widest transition-colors"
                    >
                      {currentUser.role === 'Customer' ? <Package size={20} strokeWidth={3} /> : <LayoutDashboard size={20} strokeWidth={3} />}
                      {currentUser.role === 'Customer' ? 'My Orders' : 'Dashboard'}
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm font-black text-red-600 hover:bg-red-100 hover:border-y-4 hover:border-black uppercase tracking-widest transition-colors mt-2"
                    >
                      <LogOut size={20} strokeWidth={3} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-black bg-white border-2 border-black font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-black text-[#9AE600] border-2 border-black font-black text-xs uppercase tracking-widest px-5 py-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-neutral-900 transition-colors hidden sm:block transform rotate-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Profile Modal ─── */}
      {showProfileModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] relative animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-[#9AE600] border-2 border-black p-2 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors"
            >
              <X size={20} strokeWidth={3} className="text-black" />
            </button>

            {/* Header / Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#9AE600] border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-extrabold text-3xl lilita-one-regular mb-3">
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-black text-black lilita-one-regular tracking-wide uppercase">
                {currentUser.name}
              </h2>
              <span className="bg-[#0D8DE3] text-white text-xs font-black uppercase px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1">
                {currentUser.role}
              </span>
            </div>

            {/* Profile Info Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="bg-gray-50 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Full Name</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <User size={16} strokeWidth={2.5} className="text-black shrink-0" />
                  <span className="text-sm font-black text-black uppercase">{currentUser.name}</span>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="bg-gray-50 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Mobile Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone size={16} strokeWidth={2.5} className="text-black shrink-0" />
                  <span className="text-sm font-black text-black">
                    {currentUser.phone ? `+91 ${currentUser.phone}` : 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-gray-50 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Email Address</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail size={16} strokeWidth={2.5} className="text-black shrink-0" />
                  <span className="text-sm font-black text-black truncate">{currentUser.email}</span>
                </div>
              </div>

              {/* Account Role */}
              <div className="bg-gray-50 border-2 border-black rounded-xl p-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">Account Type</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Shield size={16} strokeWidth={2.5} className="text-black shrink-0" />
                  <span className="text-sm font-black text-black">{currentUser.role} Account</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-[#0D8DE3] hover:bg-blue-600 text-white font-black py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
