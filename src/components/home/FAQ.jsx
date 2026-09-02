import React from 'react';
import { FaPhoneAlt, FaMapMarker } from "react-icons/fa";
import { IoMailUnread } from "react-icons/io5";
import { BsClockFill } from "react-icons/bs";
import contactImage from "../../assets/contactimge.png";

const contactDetails = [
    {
        icon: <FaPhoneAlt size={28} />, 
        title: "Contact", 
        details: ["+91 07814508706", "+91 6280832724"]
    },

    {
        icon: <IoMailUnread size={28} />, 
        title: "Email", 
        details: ["wowlaundry111@gmail.com"],
        border: true
    },
    {
        icon: <FaMapMarker size={28} />, 
        title: "Address", 
        details: ["11/1 WARE HOUSE, RAMA MANDI, Jalandhar Cantt, Jalandhar, Punjab 144005"],
        border: true
    },
    {
        icon: <BsClockFill size={28} />, 
        title: "Working Hours", 
        details: ["Monday - Sunday: 10:00 AM to 11:00 PM"]
    }
];


function FAQ() {
    return (
        <div className='px-4 md:px-10 lg:px-20 py-16 mt-20 flex flex-col md:flex-row justify-between gap-10 bg-white font-outfit selection:bg-black selection:text-[#B0FF49]'>
            <div className='w-full lg:w-[45%]'>
                <div className="inline-block bg-[#B0FF49] border-2 border-black px-6 py-2 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-1">
                    <div className='text-4xl md:text-5xl lilita-one-regular text-black uppercase tracking-wider'>Contact <span className='text-[#0D8DE3]'>Us</span></div>
                </div>
                
                <div className='bg-[#0D8DE3] rounded-3xl md:rounded-[40px] border-2 border-black p-6 md:p-10 mt-6 flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,1)] relative'>
                    {/* Decorative element */}
                    <div className="absolute top-8 -right-8 w-16 h-16 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-3xl transform rotate-12">
                        📞
                    </div>

                    {contactDetails.map((item, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center gap-6 py-6 ${item.border ? 'border-y-4 border-black border-dashed' : ''} group`}
                        >
                            <div className='p-4 md:p-5 rounded-2xl bg-black border-2 border-black w-fit text-[#B0FF49] shadow-[4px_4px_0px_rgba(255,255,255,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform'>
                                {item.icon}
                            </div>
                            <div>
                                <div className='text-xl font-black text-white uppercase tracking-widest bg-black inline-block px-2 py-0.5 rounded-lg border-2 border-black mb-2'>{item.title}</div>
                                {item.details.map((detail, i) => (
                                    <div key={i} className='font-bold text-white text-base md:text-lg uppercase tracking-wider'>{detail}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='flex-1 flex justify-center items-end relative'>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#B0FF49] rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -z-10 blur-sm opacity-50"></div>
                <img src={contactImage} alt="contact image" className='w-[30rem] filter drop-shadow-2xl hover:scale-105 transition-transform duration-500' />
            </div>
        </div>
    );
}

export default FAQ;