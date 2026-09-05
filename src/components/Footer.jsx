import React from 'react';
import logo from '../assets/logo.png';

function Footer() {
  return (
    <div className='mt-20 md:mx-10 bg-black rounded-t-[40px] md:rounded-t-[80px] px-10 lg:px-20 py-16 font-outfit selection:bg-[#9AE600] selection:text-black shadow-[0_-8px_0_#0D8DE3]'>
      <div className='flex justify-center'>
        <img src={logo} alt="WOW Laundry" className="h-44 md:h-56 w-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300" />
      </div>
      
      <div className='-mt-4 md:-mt-6 flex justify-center items-center'>
        <div className='font-black uppercase tracking-widest lg:w-[70%] text-sm md:text-lg text-center text-[#9AE600]'>Wear Fresh and Feel Fresh</div>
      </div>

      <div className='mt-5 flex flex-wrap justify-center gap-3 text-xs md:text-sm font-black uppercase tracking-wider text-gray-300'>
        <span className='bg-stone-900 border border-stone-700 px-3.5 py-1 rounded-full text-white shadow-sm flex items-center gap-1.5'>
          <span className='text-[#9AE600]'>📍</span> Branch 1: Rama Mandi, Jalandhar Cantt
        </span>
        <span className='bg-stone-900 border border-stone-700 px-3.5 py-1 rounded-full text-white shadow-sm flex items-center gap-1.5'>
          <span className='text-[#9AE600]'>📍</span> Branch 2: Law Gate Maheru (Shop No. 1 Gaba PG)
        </span>
      </div>
      
      <div className='py-8 border-y-4 border-dashed border-gray-800 mt-8 md:mt-16 flex justify-center items-center gap-6 md:gap-16 text-white flex-wrap'>
        <a href="#hero" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Home</a>
        <a href="#service" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Why Us?</a>
        <a href="#about" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>About Us</a>
        <a href="#faq" className='text-sm md:text-lg font-black uppercase tracking-widest cursor-pointer hover:text-[#0D8DE3] hover:-translate-y-1 transition-all'>Contact</a>
      </div>
      
      <div className='pt-8 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5'>
        <div className='font-bold uppercase tracking-widest text-gray-400 text-sm'>
            © Powered By <a href="https://helmer.world/" target='_blank' className='text-white hover:text-[#9AE600] underline decoration-2 underline-offset-4 transition-colors'>Helmer</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;