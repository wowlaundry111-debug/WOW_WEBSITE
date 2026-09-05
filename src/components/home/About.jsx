import React from 'react';
import { MdOutlineLocalLaundryService, MdStorefront } from "react-icons/md";
import { TbWash, TbTruckDelivery, TbClockHour4, TbShieldCheck } from "react-icons/tb";
import { FaStar } from "react-icons/fa";

function About() {
    return (
        <div className='mx-3 sm:mx-5 lg:mx-20 px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 md:py-16 mt-10 sm:mt-16 md:mt-20 bg-[#0D8DE3] border-2 border-black rounded-[24px] sm:rounded-[40px] md:rounded-[60px] shadow-[6px_6px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] font-outfit selection:bg-black selection:text-[#9AE600]'>

            {/* ── Section Header ─────────────────────────────────────── */}
            <div className='text-center mb-8 sm:mb-12'>
                <div className='inline-block bg-white border-2 border-black px-5 sm:px-8 py-2 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-1 sm:-rotate-2'>
                    <h2 className='text-2xl sm:text-4xl md:text-5xl lilita-one-regular text-black uppercase tracking-wider'>
                        About <span className='text-[#0D8DE3]'>Us</span>
                    </h2>
                </div>
                <div className='mt-3'>
                    <span className='inline-block bg-black text-[#9AE600] text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                        WOW Laundry — Premium care for your clothes. Convenience for your lifestyle.
                    </span>
                </div>
            </div>

            {/* ── Main Grid ─────────────────────────────────────────── */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8'>

                {/* ── LEFT COLUMN (7 cols) ─────────────────────────── */}
                <div className='lg:col-span-7 bg-white border-2 border-black p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between'>

                    {/* Decorative badge */}
                    <div className="absolute -top-4 -right-3 sm:-top-5 sm:-right-5 w-11 h-11 sm:w-14 sm:h-14 bg-[#9AE600] border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-12 z-10">
                        <TbWash className="text-xl sm:text-3xl text-black" />
                    </div>

                    <div>
                        {/* Company Name Badge */}
                        <div className='mb-3'>
                            <span className='bg-black text-[#9AE600] px-3 py-1.5 rounded-xl border-2 border-black inline-block font-black text-sm sm:text-lg md:text-xl uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                                WOW LAUNDRY SERVICES LLP
                            </span>
                        </div>

                        {/* Heading */}
                        <h3 className='text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-tight'>
                            Brings premium laundry and dry-cleaning care right to your doorstep.
                        </h3>

                        {/* Intro description */}
                        <p className='mt-4 text-stone-700 font-medium text-sm sm:text-base leading-relaxed'>
                            From everyday washing to delicate garments and professional dry cleaning, we take care of your clothes with the attention, hygiene, and quality they deserve. Our convenient <strong className='font-bold text-black bg-[#9AE600]/30 px-1 rounded'>Doorstep Pickup & Delivery</strong> service saves you time while ensuring your clothes return fresh, clean, and beautifully cared for.
                        </p>

                        {/* Quick Stats / Highlights Bar */}
                        <div className='mt-5 grid grid-cols-3 gap-2 sm:gap-3'>
                            <div className='bg-[#0D8DE3] border-2 border-black rounded-xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                                <div className='text-lg sm:text-2xl font-black text-white leading-none'>24h</div>
                                <div className='text-[10px] sm:text-xs font-black text-[#9AE600] uppercase tracking-wider mt-1'>Express Delivery</div>
                            </div>
                            <div className='bg-[#9AE600] border-2 border-black rounded-xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                                <div className='text-lg sm:text-2xl font-black text-black leading-none'>100%</div>
                                <div className='text-[10px] sm:text-xs font-black text-black uppercase tracking-wider mt-1'>Hygienic Wash</div>
                            </div>
                            <div className='bg-black border-2 border-black rounded-xl p-2.5 sm:p-3 text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]'>
                                <div className='text-lg sm:text-2xl font-black text-[#9AE600] leading-none'>Live</div>
                                <div className='text-[10px] sm:text-xs font-black text-white uppercase tracking-wider mt-1'>Outlet & Centre</div>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className='mt-6 space-y-3 sm:space-y-4'>

                            {/* Express Service */}
                            <div className='flex gap-3 sm:gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]'>
                                <div className='p-2.5 bg-black border-2 border-black rounded-xl text-[#9AE600] shadow-[2px_2px_0px_rgba(0,0,0,1)] h-fit shrink-0'>
                                    <TbClockHour4 size={24} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-sm sm:text-base font-black uppercase text-black tracking-wide'>
                                            Express Laundry Service
                                        </span>
                                        <span className='bg-[#9AE600] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black'>
                                            Within 24 Hours
                                        </span>
                                    </div>
                                    <p className='font-normal text-stone-700 mt-1 text-xs sm:text-sm leading-relaxed'>
                                        For those who need their laundry in a hurry, our Express Laundry Service delivers professionally cleaned garments within <strong>24 hours</strong>, right at your doorstep.
                                    </p>
                                </div>
                            </div>

                            {/* State-of-the-Art Facilities */}
                            <div className='flex gap-3 sm:gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]'>
                                <div className='p-2.5 bg-[#0D8DE3] border-2 border-black rounded-xl text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] h-fit shrink-0'>
                                    <MdOutlineLocalLaundryService size={24} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-sm sm:text-base font-black uppercase text-black tracking-wide'>
                                            State-of-the-Art Facilities
                                        </span>
                                        <span className='bg-black text-[#9AE600] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black'>
                                            Antiseptic & Softeners
                                        </span>
                                    </div>
                                    <p className='font-normal text-stone-700 mt-1 text-xs sm:text-sm leading-relaxed'>
                                        Every garment is processed in our state-of-the-art laundry facilities using high-quality hygienic detergents, antiseptic wash solutions, and fabric softeners to deliver exceptional cleanliness while preserving freshness, feel, and finish.
                                    </p>
                                </div>
                            </div>

                            {/* Live Processing Centre */}
                            <div className='flex gap-3 sm:gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 border-2 border-black rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]'>
                                <div className='p-2.5 bg-[#9AE600] border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] h-fit shrink-0'>
                                    <MdStorefront size={24} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-sm sm:text-base font-black uppercase text-black tracking-wide'>
                                            Live Processing Centre & Outlet
                                        </span>
                                        <span className='bg-[#0D8DE3] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black'>
                                            Complete Transparency
                                        </span>
                                    </div>
                                    <p className='font-normal text-stone-700 mt-1 text-xs sm:text-sm leading-relaxed'>
                                        For complete transparency, you can also experience our Live Processing Centre & Outlet, where you can see our professional laundry process up close.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Value pills footer */}
                    <div className='mt-6 pt-4 border-t-2 border-black flex flex-wrap gap-2'>
                        {['Doorstep Pickup & Delivery', 'Dry Cleaning', '24h Express', 'Antiseptic Wash', 'Live Outlet'].map((tag) => (
                            <span key={tag} className='bg-black text-[#9AE600] text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT COLUMN (5 cols) ────────────────────────── */}
                <div className='lg:col-span-5 flex flex-col gap-4 sm:gap-6'>

                    {/* Image Box with Badges */}
                    <div className='rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden relative flex-1 min-h-[280px] sm:min-h-[340px] bg-black'>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top floating badge */}
                        <div className='absolute top-4 left-4'>
                            <div className='bg-[#9AE600] border-2 border-black rounded-xl px-3 py-1.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2'>
                                <TbShieldCheck className='text-black text-lg sm:text-xl shrink-0' />
                                <span className='text-[10px] sm:text-xs font-black uppercase tracking-wider text-black'>
                                    100% Fabric Care Guaranteed
                                </span>
                            </div>
                        </div>

                        {/* Bottom overlay badges */}
                        <div className='absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-2 sm:gap-3'>
                            <div className='bg-white border-2 border-black rounded-xl px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2 flex-1'>
                                <TbTruckDelivery className='text-[#0D8DE3] text-xl sm:text-2xl shrink-0' />
                                <div>
                                    <div className='text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-stone-600 leading-none'>Doorstep Service</div>
                                    <div className='text-xs sm:text-sm font-black text-[#0D8DE3] leading-tight'>Fast Pickup & Delivery</div>
                                </div>
                            </div>
                            <div className='bg-[#9AE600] border-2 border-black rounded-xl px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2'>
                                <FaStar className='text-black text-lg shrink-0' />
                                <div>
                                    <div className='text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black leading-none'>Trusted Quality</div>
                                    <div className='text-xs sm:text-sm font-black text-black leading-tight'>5-Star Care</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand Promise Banner Card */}
                    <div className='bg-black text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden'>
                        <div className='relative z-10'>
                            <div className='text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#9AE600] mb-1'>
                                Our Promise
                            </div>
                            <div className='text-base sm:text-xl font-black uppercase tracking-tight leading-snug text-white'>
                                WOW Laundry — Premium care for your clothes. Convenience for your lifestyle.
                            </div>
                            <p className='mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed'>
                                Visit our live processing centre or book a doorstep pickup in seconds.
                            </p>
                        </div>
                        {/* Background subtle decoration */}
                        <div className='absolute -right-4 -bottom-4 text-white/5 pointer-events-none'>
                            <MdOutlineLocalLaundryService size={120} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default About;

