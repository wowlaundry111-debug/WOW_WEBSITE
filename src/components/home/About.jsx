import React from 'react'
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { TbWash, TbTruckDelivery } from "react-icons/tb";
import { FaStar } from "react-icons/fa";

function About() {
    return (
        <div className='mx-3 sm:mx-5 lg:mx-20 px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-24 mt-10 sm:mt-16 md:mt-20 bg-[#0D8DE3] border-2 border-black rounded-[24px] sm:rounded-[40px] md:rounded-[80px] shadow-[6px_6px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] font-outfit selection:bg-black selection:text-[#B0FF49]'>

            {/* ── Section Header ─────────────────────────────────────── */}
            <div className='text-center mb-8 sm:mb-12'>
                <div className='inline-block bg-white border-2 border-black px-4 sm:px-6 py-2 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1 sm:rotate-2'>
                    <h2 className='text-2xl sm:text-4xl md:text-5xl lilita-one-regular text-black uppercase tracking-wider'>
                        About <span className='text-[#0D8DE3]'>Us</span>
                    </h2>
                </div>
            </div>

            {/* ── Mobile: stacked | Desktop: side-by-side ───────────── */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10'>

                {/* ── LEFT CARD ───────────────────────────────────────── */}
                <div className='bg-white border-2 border-black p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative'>

                    {/* Decorative icon badge — clipped on mobile so it doesn't overflow */}
                    <div className="absolute -top-4 -right-3 sm:-top-6 sm:-right-6 w-10 h-10 sm:w-14 sm:h-14 bg-[#B0FF49] border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-12 z-10">
                        <TbWash className="text-xl sm:text-3xl text-black" />
                    </div>

                    {/* Brand Statement */}
                    <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide leading-tight pr-6 sm:pr-0'>
                        <span className='bg-black text-[#B0FF49] px-2 py-1 rounded-lg border-2 border-black inline-block transform -rotate-1 mb-2 text-base sm:text-xl md:text-2xl lg:text-3xl'>
                            WOW Laundry
                        </span>
                        {' '}is the very first Laundry in Law gate established by{' '}
                        <span className='text-[#0D8DE3] underline decoration-4 underline-offset-4'>
                            the founders of WOW Laundry
                        </span>
                    </div>

                    {/* Tagline box */}
                    <div className='mt-4 sm:mt-6 font-bold text-stone-800 text-xs sm:text-sm md:text-base uppercase tracking-widest bg-gray-100 p-3 sm:p-4 border-2 border-black rounded-xl leading-relaxed'>
                        We take care of your clothes from pickup till delivery and ensure all items are cleaned with care.
                    </div>

                    {/* ── Stats row — mobile horizontal chips ─────────── */}
                    <div className='mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3'>
                        {[
                            { value: '7+', label: 'Years\nExp.' },
                            { value: '5k+', label: 'Happy\nCustomers' },
                            { value: '24h', label: 'Turnaround' },
                        ].map(({ value, label }) => (
                            <div key={label} className='bg-[#0D8DE3] border-2 border-black rounded-xl p-2 sm:p-3 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                                <div className='text-lg sm:text-2xl font-black text-white leading-none'>{value}</div>
                                <div className='text-[9px] sm:text-xs font-black text-[#B0FF49] uppercase tracking-wider mt-0.5 whitespace-pre-line leading-tight'>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Feature card ─────────────────────────────────── */}
                    <div className='mt-4 sm:mt-6 sm:mt-8 flex gap-3 sm:gap-5 bg-[#B0FF49] p-4 sm:p-5 border-2 border-black rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1'>
                        <div className='p-2 sm:p-3 bg-black border-2 border-black rounded-xl text-[#0D8DE3] shadow-[2px_2px_0px_rgba(255,255,255,1)] h-fit shrink-0'>
                            <MdOutlineLocalLaundryService size={22} className="sm:text-[28px]" />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='text-base sm:text-xl font-black uppercase text-black tracking-widest leading-tight'>7+ Years of Experience</div>
                            <div className='font-bold text-black mt-2 text-xs sm:text-sm leading-relaxed'>
                                We've refined our washing process over 7 years so every garment is cleaned with care, speed, and precision.
                            </div>
                        </div>
                    </div>

                    {/* ── Value pills — mobile friendly ────────────────── */}
                    <div className='mt-4 flex flex-wrap gap-2'>
                        {['Pickup & Delivery', 'Express Wash', 'Eco-Friendly', 'Trusted'].map((tag) => (
                            <span key={tag} className='bg-black text-[#B0FF49] text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-black'>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: IMAGE ─────────────────────────────────────── */}
                <div className='rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden relative'>

                    {/* On mobile: fixed aspect ratio so image is visible without being too tall */}
                    <div className='relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:h-full min-h-[220px]'>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                        {/* Overlay badge */}
                        <div className='absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap'>
                            <div className='bg-white border-2 border-black rounded-2xl px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2'>
                                <TbTruckDelivery className='text-[#0D8DE3] text-lg sm:text-2xl shrink-0' />
                                <div>
                                    <div className='text-[9px] sm:text-xs font-black uppercase tracking-widest text-black leading-none'>Pickup in</div>
                                    <div className='text-sm sm:text-base font-black text-[#0D8DE3] leading-tight'>10 minutes</div>
                                </div>
                            </div>
                            <div className='bg-[#B0FF49] border-2 border-black rounded-2xl px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2'>
                                <FaStar className='text-black text-base sm:text-xl shrink-0' />
                                <div>
                                    <div className='text-[9px] sm:text-xs font-black uppercase tracking-widest text-black leading-none'>Rated</div>
                                    <div className='text-sm sm:text-base font-black text-black leading-tight'>4.9 / 5 ⭐</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
