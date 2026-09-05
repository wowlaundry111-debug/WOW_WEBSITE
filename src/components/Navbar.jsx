import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import logo from '../assets/logo.png';
import { setAuthToken } from '../services/api';

export default function Navbar() {
  const { currentUser, cart, setCurrentUser } = useAppStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setShowMenu(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'SuperAdmin' || currentUser.role === 'ShopAdmin') return '/admin';
    if (currentUser.role === 'Delivery') return '/delivery';
    return '/order-history';
  };

  return (
    <nav className="bg-[#9AE600] border-b-2 border-black sticky top-0 z-50 shadow-[0_4px_0_rgba(0,0,0,1)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 transition-colors">
              <div className="bg-black border-2 sm:border-3 border-black rounded-full shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 overflow-hidden shrink-0">
                <img src={logo} alt="WOW Laundry" className="w-16 h-16 sm:w-22 sm:h-22 object-contain scale-125" />
              </div>
              <span className="font-extrabold text-2xl sm:text-4xl text-black lilita-one-regular uppercase tracking-wider bg-white px-3 py-0.5 sm:px-4 sm:py-1 border-2 sm:border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-xl sm:rounded-2xl transform -rotate-2">
                WOW Laundry
              </span>
            </Link>
          </div>



          <div className="flex items-center gap-4 sm:gap-6">
            {(!currentUser || currentUser.role === 'Customer') && (
              <Link to="/order" className="text-black hover:text-[#0D8DE3] font-black text-sm uppercase tracking-widest hidden sm:block transition-colors">
                Services
              </Link>
            )}

            {(!currentUser || currentUser.role === 'Customer') && (
              <Link to="/cart" className="relative p-1.5 bg-white border-2 border-black rounded-xl text-black hover:bg-black hover:text-[#9AE600] shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors">
                <ShoppingCart size={20} strokeWidth={3} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-3 -right-3 inline-flex items-center justify-center w-7 h-7 text-sm font-black text-white bg-[#0D8DE3] border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="relative">
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
                <Link to="/register" className="bg-[#0D8DE3] text-white border-2 border-black font-black text-xs uppercase tracking-widest px-5 py-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-blue-600 transition-colors hidden sm:block transform rotate-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
