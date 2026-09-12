import React from 'react';
import logo from '../assets/logo.webp';
import logoSm from '../assets/logo-sm.webp';

function Footer() {
  return (
    <footer className='mt-20 md:mx-10 bg-black rounded-t-[40px] md:rounded-t-[80px] px-10 lg:px-20 py-16 font-outfit selection:bg-[#9AE600] selection:text-black shadow-[0_-8px_0_#0D8DE3]'>
      <div className='flex justify-center'>
        <img src={logo} srcSet={`${logoSm} 240w, ${logo} 480w`} sizes="(max-width: 640px) 240px, 336px" alt="WOW Laundry - Wear Fresh and Feel Fresh" width="336" height="224" loading="lazy" decoding="async" className="h-44 md:h-56 w-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300" />
      </div>
      
      <div className='-mt-4 md:-mt-6 flex justify-center items-center'>
        <div className='font-black uppercase tracking-widest lg:w-[70%] text-sm md:text-lg text-center text-[#9AE600]'>Wear Fresh and Feel Fresh</div>
      </div>
      
      <div className='py-8 border-y-4 border-dashed border-gray-800 mt-8 md:mt-16 flex justify-center items-center gap-6 md:gap-16 text-white flex-wrap'>
        <a href="#hero" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Home</a>
        <a href="#service" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Why Us?</a>
        <a href="#about" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>About Us</a>
        <a href="#faq" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Contact</a>
      </div>
      
      <div className='pt-8 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5'>
        <div className='font-bold uppercase tracking-widest text-gray-400 text-sm'>
          (C) {new Date().getFullYear()} WOW Laundry. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;