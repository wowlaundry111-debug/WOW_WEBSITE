import React, { useState } from 'react';
import Navbar from '../Navbar';
import heroimage from '../../assets/heroimage.png';
import bucketImage from '../../assets/final-bucket-cropped.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { TbTruckDelivery, TbWash, TbShirt } from "react-icons/tb";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { Link } from 'react-router-dom';

function Hero() {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [bucketLoaded, setBucketLoaded] = useState(false);

    return (
        <div className="bg-white font-outfit selection:bg-black selection:text-[#9AE600] min-h-screen relative overflow-hidden flex flex-col items-center w-full">

            <style>
                {`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { opacity: 0.8; }
                    100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
                }
                .group:hover .bubble-1 { animation: floatUp 2s ease-in-out infinite; animation-delay: 0s; }
                .group:hover .bubble-2 { animation: floatUp 2.5s ease-in-out infinite; animation-delay: 0.3s; }
                .group:hover .bubble-3 { animation: floatUp 2.2s ease-in-out infinite; animation-delay: 0.7s; }
                .group:hover .bubble-4 { animation: floatUp 2.8s ease-in-out infinite; animation-delay: 0.2s; }
                .group:hover .bubble-5 { animation: floatUp 2.1s ease-in-out infinite; animation-delay: 0.9s; }

                /* Ultra-Natural Soap Bubble Float & Burst Physics */
                @keyframes naturalBubble1 {
                    0% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                    10% { transform: translate(-3px, -12px) scale(0.85); opacity: 0.95; }
                    30% { transform: translate(-8px, -32px) scale(1.02, 0.96) rotate(-4deg); opacity: 0.95; }
                    55% { transform: translate(-4px, -55px) scale(0.96, 1.04) rotate(3deg); opacity: 0.95; }
                    75% { transform: translate(-9px, -76px) scale(1.04, 0.97) rotate(-2deg); opacity: 0.95; }
                    87% { transform: translate(-10px, -88px) scale(1.15, 0.92); opacity: 1; }
                    89% { transform: translate(-10px, -90px) scale(1.28); opacity: 0; }
                    100% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                }
                @keyframes naturalBurst1 {
                    0%, 87% { transform: scale(0.2); opacity: 0; }
                    89% { transform: scale(0.8); opacity: 1; }
                    92% { transform: scale(1.4); opacity: 0.7; }
                    95%, 100% { transform: scale(1.9); opacity: 0; }
                }

                @keyframes naturalBubble2 {
                    0% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                    10% { transform: translate(2px, -14px) scale(0.85); opacity: 0.95; }
                    32% { transform: translate(7px, -36px) scale(0.95, 1.05) rotate(5deg); opacity: 0.95; }
                    58% { transform: translate(3px, -62px) scale(1.05, 0.96) rotate(-3deg); opacity: 0.95; }
                    78% { transform: translate(9px, -84px) scale(0.97, 1.04) rotate(4deg); opacity: 0.95; }
                    88% { transform: translate(10px, -96px) scale(1.18, 0.9); opacity: 1; }
                    90% { transform: translate(10px, -98px) scale(1.3); opacity: 0; }
                    100% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                }
                @keyframes naturalBurst2 {
                    0%, 88% { transform: scale(0.2); opacity: 0; }
                    90% { transform: scale(0.9); opacity: 1; }
                    93% { transform: scale(1.5); opacity: 0.7; }
                    96%, 100% { transform: scale(2.0); opacity: 0; }
                }

                @keyframes naturalBubble3 {
                    0% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                    12% { transform: translate(3px, -16px) scale(0.88); opacity: 0.95; }
                    35% { transform: translate(9px, -42px) scale(1.03, 0.97) rotate(3deg); opacity: 0.95; }
                    60% { transform: translate(4px, -70px) scale(0.96, 1.04) rotate(-3deg); opacity: 0.95; }
                    80% { transform: translate(8px, -95px) scale(1.05, 0.96) rotate(2deg); opacity: 0.95; }
                    89% { transform: translate(9px, -108px) scale(1.2, 0.92); opacity: 1; }
                    91% { transform: translate(9px, -110px) scale(1.35); opacity: 0; }
                    100% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                }
                @keyframes naturalBurst3 {
                    0%, 89% { transform: scale(0.2); opacity: 0; }
                    91% { transform: scale(0.9); opacity: 1; }
                    94% { transform: scale(1.5); opacity: 0.7; }
                    97%, 100% { transform: scale(2.1); opacity: 0; }
                }

                @keyframes naturalBubble4 {
                    0% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                    12% { transform: translate(-3px, -14px) scale(0.85); opacity: 0.95; }
                    35% { transform: translate(-6px, -35px) scale(0.96, 1.04) rotate(-4deg); opacity: 0.95; }
                    60% { transform: translate(-1px, -58px) scale(1.04, 0.96) rotate(3deg); opacity: 0.95; }
                    80% { transform: translate(-5px, -78px) scale(0.97, 1.03) rotate(-2deg); opacity: 0.95; }
                    88% { transform: translate(-6px, -88px) scale(1.15, 0.92); opacity: 1; }
                    90% { transform: translate(-6px, -90px) scale(1.25); opacity: 0; }
                    100% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                }
                @keyframes naturalBurst4 {
                    0%, 88% { transform: scale(0.2); opacity: 0; }
                    90% { transform: scale(0.8); opacity: 1; }
                    93% { transform: scale(1.4); opacity: 0.7; }
                    96%, 100% { transform: scale(1.8); opacity: 0; }
                }

                @keyframes naturalBubble5 {
                    0% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                    10% { transform: translate(3px, -12px) scale(0.85); opacity: 0.95; }
                    32% { transform: translate(8px, -34px) scale(1.03, 0.97) rotate(4deg); opacity: 0.95; }
                    58% { transform: translate(5px, -58px) scale(0.96, 1.04) rotate(-3deg); opacity: 0.95; }
                    78% { transform: translate(11px, -80px) scale(1.04, 0.96) rotate(3deg); opacity: 0.95; }
                    87% { transform: translate(12px, -92px) scale(1.18, 0.9); opacity: 1; }
                    89% { transform: translate(12px, -94px) scale(1.28); opacity: 0; }
                    100% { transform: translate(0px, 0px) scale(0.2); opacity: 0; }
                }
                @keyframes naturalBurst5 {
                    0%, 87% { transform: scale(0.2); opacity: 0; }
                    89% { transform: scale(0.8); opacity: 1; }
                    92% { transform: scale(1.4); opacity: 0.7; }
                    95%, 100% { transform: scale(1.9); opacity: 0; }
                }

                .nat-bubble-1 { animation: naturalBubble1 4.5s ease-in-out infinite; transform-origin: 145px 20px; }
                .nat-bubble-1 .nat-burst { animation: naturalBurst1 4.5s ease-out infinite; }

                .nat-bubble-2 { animation: naturalBubble2 3.9s ease-in-out infinite 1.1s; transform-origin: 235px 26px; }
                .nat-bubble-2 .nat-burst { animation: naturalBurst2 3.9s ease-out infinite 1.1s; }

                .nat-bubble-3 { animation: naturalBubble3 5.2s ease-in-out infinite 0.4s; transform-origin: 390px 12px; }
                .nat-bubble-3 .nat-burst { animation: naturalBurst3 5.2s ease-out infinite 0.4s; }

                .nat-bubble-4 { animation: naturalBubble4 4.2s ease-in-out infinite 2.2s; transform-origin: 325px 22px; }
                .nat-bubble-4 .nat-burst { animation: naturalBurst4 4.2s ease-out infinite 2.2s; }

                .nat-bubble-5 { animation: naturalBubble5 4.7s ease-in-out infinite 3.1s; transform-origin: 505px 25px; }
                .nat-bubble-5 .nat-burst { animation: naturalBurst5 4.7s ease-out infinite 3.1s; }
            `}
            </style>

            {/* Minimal Background Elements */}
            <div className="absolute bottom-0 left-0 w-full flex overflow-hidden opacity-20 pointer-events-none">
                <div className="w-1/2 h-20 bg-[#1e88e5] rounded-tr-[100px] transform -translate-x-10"></div>
                <div className="w-1/2 h-20 bg-[#1e88e5] rounded-tl-[100px] transform translate-x-10"></div>
            </div>

            {/* FULL WIDTH NAVBAR BAND */}
            <div className="w-full relative z-50">
                <Navbar />
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="w-full max-w-[1400px] flex flex-col relative z-10 flex-1">

                <div className='p-4 lg:px-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-center justify-center max-w-[1400px] mx-auto w-full relative z-10 flex-1'>

                    {/* LEFT: THE BUCKET AND TEXT */}
                    <div className='lg:w-1/2 relative mt-8 sm:mt-6 lg:mt-0 mb-4 sm:mb-8 lg:mb-0 w-full flex justify-center group'>

                        {/* Enlarged bucket container */}
                        <div className="relative w-full max-w-[1200px] mx-auto flex justify-center items-center">

                            {/* Left Bubble Cluster & Dot Grid matching reference (Positioned completely below handle) */}
                            <div className="absolute -left-8 sm:-left-20 bottom-[2%] w-[110px] sm:w-[150px] h-[40%] sm:h-[48%] z-20 pointer-events-none select-none">
                                <svg viewBox="0 0 200 320" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="left-bubble-grid" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
                                            <circle cx="6" cy="6" r="2.5" fill="#60A5FA" opacity="0.65" />
                                        </pattern>
                                    </defs>

                                    {/* Dot grid background strip on the left */}
                                    <rect x="15" y="5" width="130" height="200" fill="url(#left-bubble-grid)" />

                                    {/* Bubble 1 (Top - safely below handle) */}
                                    <g transform="translate(125, 25)">
                                        <circle cx="0" cy="0" r="14" stroke="#1D70F7" strokeWidth="3" fill="rgba(255, 255, 255, 0.45)" />
                                        <path d="M -9 -5 A 10 10 0 0 1 4 -10" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none" />
                                        <path d="M 3 8 A 10 10 0 0 1 9 2" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none" />
                                    </g>

                                    {/* Bubble 2 (Middle) */}
                                    <g transform="translate(130, 95)">
                                        <circle cx="0" cy="0" r="19" stroke="#1D70F7" strokeWidth="3.5" fill="rgba(255, 255, 255, 0.45)" />
                                        <path d="M -12 -6 A 14 14 0 0 1 6 -13" stroke="#93C5FD" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                        <path d="M 4 11 A 14 14 0 0 1 13 3" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none" />
                                    </g>

                                    {/* Bubble 3 (Small Stray Left) */}
                                    <g transform="translate(70, 135)">
                                        <circle cx="0" cy="0" r="10" stroke="#1D70F7" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.45)" />
                                        <path d="M -6 -3 A 7 7 0 0 1 3 -7" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none" />
                                    </g>

                                    {/* Bubble 4 (Lower Middle) */}
                                    <g transform="translate(145, 180)">
                                        <circle cx="0" cy="0" r="23" stroke="#1D70F7" strokeWidth="3.5" fill="rgba(255, 255, 255, 0.45)" />
                                        <path d="M -15 -8 A 17 17 0 0 1 8 -16" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" fill="none" />
                                        <path d="M 6 15 A 17 17 0 0 1 16 5" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none" />
                                    </g>

                                    {/* Bubble 5 (Bottom Large) */}
                                    <g transform="translate(110, 260)">
                                        <circle cx="0" cy="0" r="33" stroke="#1D70F7" strokeWidth="4" fill="rgba(255, 255, 255, 0.5)" />
                                        <path d="M -21 -12 A 25 25 0 0 1 12 -24" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" fill="none" />
                                        <path d="M 9 21 A 25 25 0 0 1 23 8" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" fill="none" />
                                    </g>
                                </svg>
                            </div>

                            {/* Horizontal Handles pushed much further inward to attach to the basket body (covering the grey handles of the image) */}
                            {/* Hidden since the new custom bucket image has its own matching brutalist handles */}
                            <div className="hidden absolute left-[16%] md:left-[18%] top-[45%] w-16 md:w-24 h-10 md:h-12 bg-gradient-to-b from-[#9AE600] to-[#8cd927] border-[4px] border-black rounded-l-full shadow-[inset_2px_2px_0px_rgba(255,255,255,0.5)] z-[-1] transition-transform duration-300 group-hover:-translate-x-3"></div>
                            <div className="hidden absolute right-[16%] md:right-[18%] top-[45%] w-16 md:w-24 h-10 md:h-12 bg-gradient-to-b from-[#9AE600] to-[#8cd927] border-[4px] border-black rounded-r-full shadow-[inset_2px_2px_0px_rgba(255,255,255,0.5)] z-[-1] transition-transform duration-300 group-hover:translate-x-3"></div>

                            {!bucketLoaded && <Skeleton className="w-full aspect-[4/3] rounded-3xl" />}
                            <img
                                src={bucketImage}
                                alt="Laundry Bucket"
                                className={`w-full h-auto object-contain relative z-0 ${bucketLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] group-hover:scale-[1.02] transition-transform origin-bottom`}
                                onLoad={() => setBucketLoaded(true)}
                            />

                            {/* Rich Soap Foam with billowing mounds and cartoon suds textures */}
                            <div className="absolute -top-[4.5%] sm:-top-[5.5%] md:-top-[6%] left-[5.5%] w-[89%] h-[24%] sm:h-[27%] z-10 pointer-events-none select-none transition-transform duration-300 group-hover:scale-[1.02] origin-bottom">
                                <svg viewBox="0 0 600 130" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Cavity Dark Depth Base */}
                                    <ellipse cx="300" cy="70" rx="265" ry="40" fill="#013A78" opacity="0.6" />

                                    {/* Ultra-Natural Floating & Bursting Foam Bubbles */}
                                    {/* Bubble 1 (Left Suave Drift) */}
                                    <g className="nat-bubble-1">
                                        <g>
                                            <circle cx="145" cy="20" r="10" stroke="#1D70F7" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.85)" />
                                            <path d="M 139 14 A 6 6 0 0 1 148 12" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <circle cx="151" cy="24" r="1.5" fill="#60A5FA" opacity="0.7" />
                                        </g>
                                        <g className="nat-burst" transform="translate(145, 20)">
                                            <circle cx="0" cy="0" r="12" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
                                            <circle cx="-11" cy="-9" r="2" fill="#38BDF8" />
                                            <circle cx="11" cy="-8" r="1.8" fill="#38BDF8" />
                                            <circle cx="-9" cy="10" r="1.8" fill="#38BDF8" />
                                            <circle cx="10" cy="9" r="2" fill="#38BDF8" />
                                        </g>
                                    </g>

                                    {/* Bubble 2 (Center-Left Flutter) */}
                                    <g className="nat-bubble-2">
                                        <g>
                                            <circle cx="235" cy="26" r="7.5" stroke="#1D70F7" strokeWidth="2" fill="rgba(255, 255, 255, 0.85)" />
                                            <path d="M 231 22 A 4.5 4.5 0 0 1 237 20" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                        </g>
                                        <g className="nat-burst" transform="translate(235, 26)">
                                            <circle cx="0" cy="0" r="9" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
                                            <circle cx="-8" cy="-7" r="1.5" fill="#38BDF8" />
                                            <circle cx="8" cy="-6" r="1.5" fill="#38BDF8" />
                                            <circle cx="-6" cy="7" r="1.5" fill="#38BDF8" />
                                            <circle cx="7" cy="7" r="1.5" fill="#38BDF8" />
                                        </g>
                                    </g>

                                    {/* Bubble 3 (Hero Majestic Sphere) */}
                                    <g className="nat-bubble-3">
                                        <g>
                                            <circle cx="390" cy="12" r="15" stroke="#1D70F7" strokeWidth="3" fill="rgba(255, 255, 255, 0.85)" />
                                            <path d="M 381 4 A 10 10 0 0 1 396 1" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                            <path d="M 394 19 A 10 10 0 0 1 401 12" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
                                        </g>
                                        <g className="nat-burst" transform="translate(390, 12)">
                                            <circle cx="0" cy="0" r="18" stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.7" />
                                            <circle cx="-15" cy="-13" r="2.5" fill="#38BDF8" />
                                            <circle cx="15" cy="-12" r="2.5" fill="#38BDF8" />
                                            <circle cx="-13" cy="14" r="2" fill="#38BDF8" />
                                            <circle cx="14" cy="13" r="2.5" fill="#38BDF8" />
                                            <circle cx="0" cy="-17" r="2" fill="#38BDF8" />
                                            <circle cx="0" cy="17" r="2" fill="#38BDF8" />
                                        </g>
                                    </g>

                                    {/* Bubble 4 (Center-Right Gentle Rise) */}
                                    <g className="nat-bubble-4">
                                        <g>
                                            <circle cx="325" cy="22" r="9" stroke="#1D70F7" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.85)" />
                                            <path d="M 320 17 A 5.5 5.5 0 0 1 327 15" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                        </g>
                                        <g className="nat-burst" transform="translate(325, 22)">
                                            <circle cx="0" cy="0" r="11" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
                                            <circle cx="-10" cy="-8" r="1.8" fill="#38BDF8" />
                                            <circle cx="10" cy="-7" r="1.8" fill="#38BDF8" />
                                            <circle cx="-8" cy="9" r="1.8" fill="#38BDF8" />
                                            <circle cx="9" cy="8" r="1.8" fill="#38BDF8" />
                                        </g>
                                    </g>

                                    {/* Bubble 5 (Right Corner Drifter) */}
                                    <g className="nat-bubble-5">
                                        <g>
                                            <circle cx="505" cy="25" r="11" stroke="#1D70F7" strokeWidth="2.5" fill="rgba(255, 255, 255, 0.85)" />
                                            <path d="M 499 19 A 7 7 0 0 1 509 16" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none" />
                                        </g>
                                        <g className="nat-burst" transform="translate(505, 25)">
                                            <circle cx="0" cy="0" r="13" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
                                            <circle cx="-12" cy="-10" r="2" fill="#38BDF8" />
                                            <circle cx="12" cy="-9" r="2" fill="#38BDF8" />
                                            <circle cx="-10" cy="11" r="2" fill="#38BDF8" />
                                            <circle cx="11" cy="10" r="2" fill="#38BDF8" />
                                        </g>
                                    </g>

                                    {/* LAYER 1: BACK FOAM SHADOW MASS (Ice Blue with bold outline) */}
                                    <path
                                        d="M 50 78
                                           C 40 45, 80 18, 130 14
                                           C 170 10, 205 24, 235 30
                                           C 270 36, 305 38, 335 22
                                           C 365 5, 420 -2, 465 10
                                           C 515 22, 560 40, 565 75
                                           C 570 105, 470 115, 300 115
                                           C 130 115, 45 105, 50 78 Z"
                                        fill="#BAE6FD"
                                        stroke="black"
                                        strokeWidth="3.5"
                                        strokeLinejoin="round"
                                    />

                                    {/* LAYER 2: MAIN FLUFFY WHITE FOAM MASS (Billowing mounds with ups & downs) */}
                                    <path
                                        d="M 46 76
                                           C 38 48, 75 22, 125 18
                                           C 165 14, 200 28, 230 34
                                           C 265 40, 300 42, 330 25
                                           C 360 8, 415 2, 460 14
                                           C 510 26, 555 44, 560 74
                                           C 565 102, 465 112, 300 112
                                           C 135 112, 42 102, 46 76 Z"
                                        fill="white"
                                        stroke="black"
                                        strokeWidth="3.5"
                                        strokeLinejoin="round"
                                    />

                                    {/* FOAM CREST DEFINING ARCS (Cartoon suds lobes & pillows) */}
                                    {/* Left Mound Creases */}
                                    <path d="M 85 55 C 105 32, 145 28, 175 42" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <path d="M 140 48 C 165 35, 200 38, 225 58" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <path d="M 60 78 C 80 62, 110 65, 125 80" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                                    {/* Center Valley Creases */}
                                    <path d="M 220 62 C 245 52, 275 54, 295 68" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M 270 70 C 290 62, 320 64, 335 78" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                                    {/* Right Tall Mound Creases */}
                                    <path d="M 330 38 C 360 15, 415 10, 450 28" stroke="black" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                    <path d="M 425 32 C 455 18, 495 24, 520 48" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
                                    <path d="M 490 52 C 515 42, 545 48, 555 68" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                                    {/* Scalloped Front Lip Suds Pillows */}
                                    <path d="M 80 82 C 105 72, 135 74, 150 90" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M 155 88 C 185 76, 225 78, 245 94" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M 250 92 C 285 80, 325 82, 350 95" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M 355 92 C 390 80, 430 80, 455 94" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                    <path d="M 460 90 C 490 78, 525 80, 545 88" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                                    {/* GLOSSY SUDS HIGHLIGHTS (Curved Sky-Blue Reflections) */}
                                    <path d="M 105 28 C 125 22, 155 24, 170 34" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                    <path d="M 365 18 C 395 10, 435 12, 455 22" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />
                                    <path d="M 470 28 C 495 24, 520 30, 535 40" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />

                                    {/* EMBEDDED MINI SUDS BUBBLES (Tiny realistic clusters on foam surface) */}
                                    <circle cx="130" cy="55" r="5" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                    <circle cx="138" cy="58" r="3" stroke="#0284C7" strokeWidth="1" fill="white" />
                                    <circle cx="210" cy="52" r="6" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                    <circle cx="280" cy="65" r="5" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                    <circle cx="365" cy="50" r="6" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                    <circle cx="375" cy="54" r="4" stroke="#0284C7" strokeWidth="1" fill="white" />
                                    <circle cx="440" cy="52" r="7" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                    <circle cx="452" cy="56" r="4" stroke="#0284C7" strokeWidth="1" fill="white" />
                                    <circle cx="510" cy="62" r="5" stroke="#0284C7" strokeWidth="1.5" fill="white" />
                                </svg>
                            </div>

                            {/* Hover Bubbles (shred bubbles from inside to up) */}
                            <div className="absolute inset-0 z-10 overflow-visible pointer-events-none">
                                <div className="absolute top-[30%] left-[20%] w-8 h-8 rounded-full border-[3px] border-white/60 bg-white/10 opacity-0 bubble-1"></div>
                                <div className="absolute top-[40%] left-[40%] w-5 h-5 rounded-full border-[2px] border-white/60 bg-white/10 opacity-0 bubble-2"></div>
                                <div className="absolute top-[25%] right-[30%] w-10 h-10 rounded-full border-[4px] border-white/60 bg-white/10 opacity-0 bubble-3"></div>
                                <div className="absolute top-[45%] right-[15%] w-6 h-6 rounded-full border-[2px] border-white/60 bg-white/10 opacity-0 bubble-4"></div>
                                <div className="absolute top-[35%] left-[60%] w-7 h-7 rounded-full border-[3px] border-white/60 bg-white/10 opacity-0 bubble-5"></div>
                            </div>

                            {/* HTML TEXT CONSTRAINED INSIDE THE BUCKET */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10%] pt-[23%] pb-[11%] z-20 pointer-events-none">

                                {/* Scaled down heavily to perfectly fit within the blue area */}
                                <div className="w-full flex flex-col items-center justify-center origin-center transform scale-[0.78] sm:scale-[0.7] md:scale-[0.75] lg:scale-[0.85] pointer-events-auto gap-2 md:gap-2.5">

                                    {/* Features Box - moved to top and sized down horizontally */}
                                    <div className='bg-white border-[2px] md:border-[3px] border-black rounded-full px-2 py-1 md:px-3 md:py-2 flex gap-1 md:gap-2 justify-center items-center shadow-[3px_3px_0px_rgba(0,0,0,1)] z-30 w-[65%] max-w-[380px] mb-1'>
                                        <div className='flex items-center gap-1 cursor-default group/feat'>
                                            <div className="bg-[#9AE600] p-1 md:p-1.5 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_#000] group-hover/feat:-translate-y-1 transition-transform">
                                                <TbTruckDelivery className='text-[8px] md:text-base text-black' />
                                            </div>
                                            <div className='text-[7px] md:text-[6px] font-black uppercase tracking-wider text-black leading-tight'>Fast <br /> Pickup</div>
                                        </div>
                                        <div className='w-0.5 h-5 bg-black rounded-full opacity-20'></div>
                                        <div className='flex items-center gap-1 cursor-default group/feat'>
                                            <div className="bg-[#2185E4] p-1 md:p-1.5 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_#000] group-hover/feat:-translate-y-1 transition-transform">
                                                <GiReceiveMoney className='text-[8px] md:text-base text-white' />
                                            </div>
                                            <div className='text-[7px] md:text-[6px] font-black uppercase tracking-wider text-black leading-tight'>Affordable <br /> Price</div>
                                        </div>
                                        <div className='w-0.5 h-5 bg-black rounded-full opacity-20'></div>
                                        <div className='flex items-center gap-1 cursor-default group/feat'>
                                            <div className="bg-white p-1 md:p-1.5 border-[2px] border-black rounded-lg shadow-[2px_2px_0px_#000] group-hover/feat:-translate-y-1 transition-transform">
                                                <TbWash className='text-[8px] md:text-base text-black' />
                                            </div>
                                            <div className='text-[7px] md:text-[6px] font-black uppercase tracking-wider text-black leading-tight'>Surfexel <br /> Wash</div>
                                        </div>
                                    </div>

                                    {/* Main Headline */}
                                    <h1 className='mt-1 font-black text-[32px] xs:text-[26px] sm:text-[38px] md:text-[50px] lg:text-[55px] leading-[1.1] text-white uppercase relative z-20 lilita-one-regular tracking-wide drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] w-full flex flex-col items-center'>
                                        <span className="mb-1">Best Washing</span>
                                        <div className="flex justify-center items-center gap-2 mb-1">
                                            <span>With</span>
                                            <span className='bg-black text-[#9AE600] px-3 py-0.5 md:px-4 md:py-1 rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0px_#9AE600] transform -rotate-2 hover:scale-105 transition-transform'>Fast</span>
                                            <span>And</span>
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <span className='bg-white text-black px-3 py-0.5 md:px-4 md:py-1 rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0px_#000] transform rotate-2 hover:scale-105 transition-transform'>Express</span>
                                            <span>Delivery</span>
                                        </div>
                                    </h1>

                                    {/* Book Order Button — hidden on mobile, shown sm+ (mobile gets its own button below) */}
                                    <div className='hidden sm:block relative z-20 w-[72%] max-w-[340px] mt-2 md:mt-3'>
                                        <Link to={'/order'}>
                                            <button className='w-full bg-[#9AE600] hover:bg-[#9de83a] text-black px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-base font-black uppercase tracking-widest rounded-full border-[2.5px] md:border-[3.5px] border-black shadow-[4px_4px_0px_#000] md:shadow-[5px_5px_0px_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2.5 transition-all group cursor-pointer'>
                                                <div className="bg-black text-[#9AE600] p-1.5 md:p-2 rounded-full border-[1.5px] md:border-[2px] border-black group-hover:rotate-[360deg] transition-transform duration-700 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" className="md:w-[17px] md:h-[17px]">
                                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                                    </svg>
                                                </div>
                                                <span className="whitespace-nowrap font-black">Book Your Order</span>
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Pricing Box (Below) */}
                                    <div className='bg-[#1565C0] border-[2px] md:border-[3px] border-black px-3.5 py-1.5 md:px-5 md:py-2 rounded-2xl max-w-[85%] relative z-20 shadow-[3px_3px_0px_#000] transition-transform hover:-translate-y-0.5 mt-1'>
                                        <p className='font-black text-white uppercase text-[9.5px] md:text-xs tracking-widest leading-relaxed text-center'>
                                            The <span className='text-[#9AE600]'>First & Best</span> Laundry. <br /> 
                                            Always <span className='text-[#9AE600] text-xs md:text-sm font-black ml-0.5'>Affordable</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE-ONLY: Book Now button floating between bucket and man */}
                    <div className='block sm:hidden w-full flex justify-center items-center py-4 z-30 relative'>
                        <Link to={'/order'}>
                            <button className='bg-[#9AE600] active:bg-[#9de83a] text-black px-9 py-3.5 text-base font-black uppercase tracking-widest rounded-full border-[3.5px] border-black shadow-[5px_5px_0px_#000] active:translate-y-1 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-3 transition-all cursor-pointer'>
                                <div className="bg-black text-[#9AE600] p-2 rounded-full border-[2px] border-black shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                    </svg>
                                </div>
                                <span className="whitespace-nowrap font-black">Book Your Order</span>
                            </button>
                        </Link>
                    </div>


                    {/* RIGHT: THE MAN */}
                    <div className='lg:w-1/2 flex flex-col justify-end items-center relative h-full mt-10 lg:mt-0'>

                        {/* Bubble / Dot Grid on the Right */}
                        <div className="absolute -right-2 sm:-right-8 top-[8%] w-[55%] h-[85%] z-0 pointer-events-none opacity-60">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="bubble-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                                        <circle cx="6" cy="6" r="3" fill="#60A5FA" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#bubble-grid)" />
                            </svg>
                        </div>

                        {/* Smooth Organic Rounded Green Vector Shape (Zero Pointiness) */}
                        <div className="absolute top-[1%] left-[0%] sm:left-[3%] w-[96%] sm:w-[92%] aspect-square z-10 pointer-events-none">
                            <svg viewBox="0 0 600 600" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer Contour Line */}
                                <path
                                    d="M 50 350
                                       C 50 230, 135 140, 245 95
                                       C 345 50, 465 70, 535 145
                                       C 605 220, 600 365, 540 445
                                       C 480 525, 355 550, 250 530
                                       C 145 510, 50 440, 50 350 Z"
                                    stroke="#B8FF3D"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                                {/* Main Solid Lime Green Shape */}
                                <path
                                    d="M 66 350
                                       C 66 242, 145 156, 250 112
                                       C 345 70, 455 88, 522 158
                                       C 586 228, 582 360, 526 435
                                       C 470 510, 355 534, 255 516
                                       C 155 496, 66 430, 66 350 Z"
                                    fill="#92DA12"
                                />
                            </svg>
                        </div>

                        {/* Black Sparkles on the Left */}
                        <div className="absolute top-[16%] left-[2%] sm:left-[6%] z-20 pointer-events-none flex flex-col items-center select-none">
                            <span className="text-black text-2xl font-bold leading-none transform -rotate-12">✦</span>
                            <span className="text-black text-base font-bold leading-none ml-4 mt-1">✦</span>
                        </div>

                        {/* Clean Poppins Typography Badge with Broken Line & Intersecting Stars */}
                        <div className="absolute top-1 right-2 sm:right-6 bg-white rounded-full w-28 h-28 sm:w-36 sm:h-36 flex flex-col justify-center items-center shadow-[4px_4px_0px_#000] z-30 select-none">
                            
                            {/* Broken Outline and 3 Blue Stars in the gap */}
                            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Black Circle Outline with top-right gap */}
                                <path
                                    d="M 125 40 A 70 70 0 1 0 144 65"
                                    stroke="black"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    fill="none"
                                />

                                {/* Top Star (small) */}
                                <g transform="translate(100, 22)">
                                    <path d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Q 0 0 0 -6 Z" fill="#1D70F7" />
                                </g>

                                {/* Main Big Star in the gap between the lines */}
                                <g transform="translate(136, 24)">
                                    <path d="M 0 -15 Q 0 0 15 0 Q 0 0 0 15 Q 0 0 -15 0 Q 0 0 0 -15 Z" fill="#1D70F7" />
                                </g>

                                {/* Bottom Star in the gap */}
                                <g transform="translate(148, 54)">
                                    <path d="M 0 -7 Q 0 0 7 0 Q 0 0 0 7 Q 0 0 -7 0 Q 0 0 0 -7 Z" fill="#1D70F7" />
                                </g>
                            </svg>

                            {/* Unified Rotated Dynamic Text Group */}
                            <div className="flex flex-col items-center justify-center transform -rotate-6 z-10 select-none mt-1">
                                <span className="font-black text-[10px] sm:text-[13px] tracking-widest uppercase text-black leading-none lilita-one-regular">
                                    A LAUNDRY
                                </span>

                                <span className="font-black text-[9px] sm:text-[11px] tracking-widest uppercase text-black leading-none my-0.5 sm:my-1 lilita-one-regular">
                                    FOR
                                </span>

                                <span 
                                    className="font-black text-[15px] sm:text-[21px] tracking-wide uppercase text-[#9AE600] leading-tight lilita-one-regular" 
                                    style={{ 
                                        WebkitTextStroke: '1.2px black',
                                        textShadow: '1.5px 1.5px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
                                    }}
                                >
                                    EVERYONE.
                                </span>
                            </div>
                        </div>

                        {!imageLoaded && <Skeleton className="w-full max-w-[500px] h-[500px]" />}
                        <img
                            src={heroimage}
                            alt="WOW Laundry Professional"
                            className={`w-full max-w-[430px] lg:max-w-[530px] object-contain relative z-20 drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] scale-110 transform -translate-y-8 md:-translate-y-12 mb-4 ${imageLoaded ? '' : 'hidden'}`}
                            onLoad={() => setImageLoaded(true)}
                        />



                        {/* RESTORED: CSS 3D Laundry Basket in front of the specialist */}
                        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-1/2 transform translate-x-1/2 bg-gradient-to-br from-[#1F8AF2] to-[#0a5cb5] border-[4px] border-black rounded-t-[10px] rounded-b-[40px] w-[250px] md:w-[350px] h-32 md:h-40 z-30 shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center overflow-hidden">

                            {/* Basket highlight */}
                            <div className="absolute top-0 left-0 w-full h-3 bg-white/20"></div>

                            {/* Basket holes pattern */}
                            <div className="flex gap-2 md:gap-3 mb-2 md:mb-3 relative z-10">
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                            </div>
                            <div className="flex gap-2 md:gap-3 mb-3 md:mb-5 relative z-10">
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-black rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"></div>
                            </div>

                            <div className="bg-[#9AE600] border-[2px] md:border-[4px] border-black px-4 py-1.5 md:px-6 md:py-2 rounded-xl shadow-[2px_2px_0px_#000] relative z-10 transform -rotate-2 hover:rotate-2 transition-transform cursor-pointer">
                                <span className="font-black text-black text-[10px] md:text-sm uppercase tracking-widest text-center block leading-tight">Clean Clothes<br />Happy You!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
