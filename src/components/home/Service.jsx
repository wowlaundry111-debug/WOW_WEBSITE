import React, { useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { TbWash, TbHanger, TbIroning3, TbTruckDelivery } from "react-icons/tb";
import { FaApple, FaAndroid } from "react-icons/fa";
import { X, Sparkles, Download, CheckCircle2 } from "lucide-react";
import { useAppStore } from '../../store/useAppStore';
import first from '../../assets/firstimage.jpeg';
import second from '../../assets/secondimage.jpeg';
import third from '../../assets/thirdimage.jpeg';

export function getDirectDownloadUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  return trimmed;
}

function Service() {
  const { shops, currentTenantId, initializeAppData } = useAppStore();
  const [iosModalOpen, setIosModalOpen] = useState(false);

  React.useEffect(() => {
    if (!shops || shops.length === 0) {
      initializeAppData();
    }
  }, [shops, initializeAppData]);

  // Find any shop that has androidAppUrl or iosAppUrl configured by SuperAdmin
  const globalAndroid = shops?.find(s => s.androidAppUrl && s.androidAppUrl.trim())?.androidAppUrl || '';
  const globalIos = shops?.find(s => s.iosAppUrl && s.iosAppUrl.trim())?.iosAppUrl || '';

  const currentShop = (shops && shops.length > 0)
    ? (shops.find(s => s._id === currentTenantId) || shops[0])
    : null;

  const effectiveAndroid = (currentShop?.androidAppUrl && currentShop.androidAppUrl.trim()) || globalAndroid;
  const effectiveIos = (currentShop?.iosAppUrl && currentShop.iosAppUrl.trim()) || globalIos;

  const androidUrl = getDirectDownloadUrl(effectiveAndroid);
  const iosUrl = effectiveIos;

  const handleAndroidDownload = () => {
    if (androidUrl) {
      const link = document.createElement('a');
      link.href = androidUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Android App download link will be available soon! SuperAdmin can add the APK link in Admin Dashboard.");
    }
  };

  const handleIosClick = () => {
    if (iosUrl) {
      window.open(iosUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIosModalOpen(true);
    }
  };


  return (
    <div className='p-6 lg:px-20 lg:py-16 mt-10 bg-white font-outfit selection:bg-black selection:text-[#9AE600]'>
      <div className='lg:flex justify-between items-center'>
        <div className='lg:w-1/2'>
          <div className="inline-block bg-[#0D8DE3] border-2 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 transform -rotate-2">
            <h2 className='text-4xl md:text-5xl lilita-one-regular text-white uppercase tracking-wider'>Why <span className='text-[#9AE600]'>Us??</span></h2>
          </div>
          <ul className='text-sm md:text-lg mt-4 md:mt-8 font-black uppercase tracking-widest text-black space-y-4'>
            {[
              { text: "We Offer the widest variety of cleaning", icon: <TbWash className='text-xl md:text-2xl' /> },
              { text: "Most Affordable price in the whole area", icon: <TbHanger className='text-xl md:text-2xl' /> },
              { text: "We use best machines and washing products", icon: <TbIroning3 className='text-xl md:text-2xl' /> },
              { text: "We deliver your clothes on the 3rd day after Pickup", icon: <TbTruckDelivery className='text-xl md:text-2xl' /> }
            ].map((item, index) => (
              <li key={index} className='flex items-center gap-4 bg-[#9AE600] border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]'>
                <div className='p-2 bg-black border-2 border-black rounded-xl text-[#0D8DE3] shadow-[2px_2px_0px_rgba(255,255,255,1)]'>
                  {item.icon}
                </div>
                <span className='text-black leading-tight'>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Download App Section */}
        <div className='lg:w-5/12 mt-16 lg:mt-0 flex flex-col justify-center items-center lg:items-end relative'>
          <div className='bg-[#0D8DE3] border-4 border-black p-8 rounded-[40px] shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center w-full max-w-md relative'>
            {/* Decorative circles */}
            <div className="absolute -top-5 -left-5 w-12 h-12 bg-[#9AE600] border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-bounce-soft"></div>
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-bounce-soft" style={{ animationDelay: '1s' }}></div>

            <h3 className='text-3xl md:text-4xl lilita-one-regular text-white uppercase tracking-wide mb-2'>
              Get The <span className='text-[#9AE600]'>App</span>
            </h3>
            <p className='text-sm md:text-base font-bold text-white uppercase tracking-widest mb-8'>
              Order laundry right from your phone.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              {/* iOS Button */}
              <button
                onClick={handleIosClick}
                className='flex-1 flex items-center justify-center gap-3 bg-black text-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all group cursor-pointer'
              >
                <FaApple className='text-3xl group-hover:text-[#9AE600] transition-colors' />
                <div className='text-left'>
                  <div className='text-[10px] uppercase tracking-widest text-gray-300'>For Apple</div>
                  <div className='text-lg font-black uppercase leading-none mt-1'>iOS App</div>
                </div>
              </button>
              
              {/* Android Button */}
              <button
                onClick={handleAndroidDownload}
                className='flex-1 flex items-center justify-center gap-3 bg-[#9AE600] text-black p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all group cursor-pointer'
              >
                <FaAndroid className='text-3xl text-black group-hover:scale-110 transition-transform' />
                <div className='text-left'>
                  <div className='text-[10px] uppercase tracking-widest text-black/80 font-bold'>For Phone</div>
                  <div className='text-lg font-black uppercase leading-none mt-1 text-black'>Android</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS App Coming Soon Modal */}
      {iosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[10px_10px_0px_rgba(0,0,0,1)] w-full max-w-md text-center relative animate-pop-in">
            <button 
              onClick={() => setIosModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-black hover:text-white border-2 border-black rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-20 h-20 bg-black text-[#9AE600] border-4 border-black rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-5">
              <FaApple size={44} />
            </div>

            <span className="inline-block bg-[#0D8DE3] text-white border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              App Store Release
            </span>

            <h3 className="text-3xl font-black uppercase text-black mb-3 lilita-one-regular">
              iOS App Coming Soon!
            </h3>

            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide leading-relaxed mb-6">
              We are currently putting the finishing touches on our official Apple App Store release. You can place orders seamlessly right here on the website or download our Android APK!
            </p>

            <div className="space-y-3">
              {androidUrl && (
                <button
                  onClick={() => {
                    setIosModalOpen(false);
                    handleAndroidDownload();
                  }}
                  className="w-full bg-[#9AE600] text-black border-2 border-black p-3.5 rounded-2xl font-black uppercase text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download Android APK Instead
                </button>
              )}
              <button
                onClick={() => setIosModalOpen(false)}
                className="w-full bg-black text-white border-2 border-black p-3.5 rounded-2xl font-black uppercase text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
            
            <div className='mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10'>
                <div className='rounded-3xl overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:rotate-1 transition-all group'>
                    <div className="bg-[#9AE600] border-b-2 border-black p-3 text-center font-black uppercase tracking-widest text-black">Modern Wash</div>
                    <img src={first} alt="Service 1" className='w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500' />
                </div>

                <div className='rounded-3xl overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:-rotate-1 transition-all group'>
                    <div className="bg-[#0D8DE3] border-b-2 border-black p-3 text-center font-black uppercase tracking-widest text-white">Premium Press</div>
                    <img src={second} alt="Service 2" className='w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500' />
                </div>

                <div className='rounded-3xl overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 hover:rotate-2 transition-all group col-span-2 lg:col-span-1'>
                    <div className="bg-black border-b-2 border-black p-3 text-center font-black uppercase tracking-widest text-[#9AE600]">Care & Quality</div>
                    <img src={third} alt="Service 3" className='w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500' />
                </div>
            </div>
        </div>
    );
}

export default Service;
