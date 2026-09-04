import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Smartphone } from 'lucide-react';
import logo from '../../assets/logo.png';

/**
 * The WOW Laundry website is a STAFF-ONLY portal.
 * Customers place orders via the mobile app — not via the website.
 * Staff accounts (ShopAdmin, Delivery) are created by the SuperAdmin.
 * There is no self-registration on this portal.
 */
export default function Register() {
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
          <div className="bg-white border-2 border-black rounded-full p-2 shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-3 flex items-center justify-center w-24 h-24 overflow-hidden">
            <img src={logo} alt="WOW Laundry" className="w-22 h-22 object-contain scale-125" />
          </div>
          <h1 className="text-3xl font-extrabold text-black lilita-one-regular tracking-wide bg-white px-6 py-1.5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl transform -rotate-2">
            Staff Portal
          </h1>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl p-8 w-full border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up text-center" style={{ animationDelay: '100ms' }}>

          <div className="flex justify-center mb-5">
            <div className="bg-yellow-100 border-2 border-black rounded-full p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <ShieldAlert size={36} strokeWidth={2.5} className="text-yellow-700" />
            </div>
          </div>

          <h2 className="text-xl font-black text-black uppercase tracking-widest mb-3">
            Staff Accounts Only
          </h2>

          <p className="text-sm font-bold text-gray-600 mb-6 leading-relaxed">
            This portal is for <strong className="text-black">WOW Laundry staff</strong> only —
            Shop Admins, Delivery staff, and Super Admins.
            <br /><br />
            Staff accounts are created by the <strong className="text-black">Super Admin</strong>.
            Contact your manager to get access.
          </p>

          {/* Divider */}
          <div className="border-t-2 border-black border-dashed my-6" />

          {/* Customer callout */}
          <div className="bg-[#B0FF49] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-center gap-3 justify-center mb-2">
              <Smartphone size={20} strokeWidth={2.5} />
              <span className="text-sm font-black uppercase tracking-widest text-black">Are you a customer?</span>
            </div>
            <p className="text-xs font-bold text-black">
              Download the <strong>WOW Laundry mobile app</strong> to place laundry orders.
              This website is not for customers.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full bg-[#0D8DE3] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-y-2 active:translate-x-2 active:shadow-none transition-all text-lg uppercase tracking-widest"
          >
            ← Back to Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
}
