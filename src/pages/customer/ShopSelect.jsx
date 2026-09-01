import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Building, ChevronRight, Store } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function ShopSelect() {
  const { shops, currentUser, setCurrentTenantId } = useAppStore();
  const navigate = useNavigate();

  const handleSelect = (shopId) => {
    setCurrentTenantId(shopId);
    navigate('/order');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit selection:bg-black selection:text-white">
      <Navbar />
      
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        <div className="mb-10 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-[#B0FF49] border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Store size={32} strokeWidth={2.5} className="text-black" />
          </div>
          <h1 className="text-4xl font-extrabold text-black lilita-one-regular tracking-wide">
            Welcome, {currentUser?.name?.split(' ')[0] || 'Guest'}!
          </h1>
          <p className="text-gray-600 mt-2 font-black uppercase tracking-widest text-sm">Select a branch to begin</p>
        </div>

        <div className="space-y-6">
          {shops.map((shop, idx) => {
            const isOpen = shop.isOpen ?? true;
            return (
              <button
                key={shop._id}
                onClick={() => handleSelect(shop._id)}
                className="w-full bg-[#B0FF49] rounded-2xl p-6 flex items-center border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none group text-left animate-fade-in-up opacity-0"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 border-2 border-black group-hover:scale-110 transition-transform duration-300 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <Building size={32} strokeWidth={2.5} className="text-black" />
                </div>
                
                <div className="ml-5 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl font-black text-black lilita-one-regular tracking-wide">{shop.name}</h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-black ${
                      isOpen ? 'bg-[#B0FF49]' : 'bg-[#0D8DE3]'
                    }`}>
                      <div className={`w-2 h-2 rounded-full border border-black ${isOpen ? 'bg-black animate-pulse' : 'bg-black'}`}></div>
                      <span className={`text-[10px] font-black tracking-widest uppercase text-black`}>
                        {isOpen ? 'ACTIVE' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-black font-extrabold bg-white border-2 border-black px-3 py-1.5 rounded-lg inline-flex">
                    <MapPin size={16} strokeWidth={3} />
                    <span className="text-sm uppercase tracking-wider">
                      {shop.branches?.join(' · ') || shop.address || 'Location unknown'}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#B0FF49] group-hover:bg-white group-hover:text-black border-2 border-black transition-colors ml-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <ChevronRight size={24} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}

          {shops.length === 0 && (
            <div className="text-center py-16 bg-gray-100 border-4 border-dashed border-black rounded-3xl">
              <p className="text-black font-black uppercase tracking-widest text-xl">No shops available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
