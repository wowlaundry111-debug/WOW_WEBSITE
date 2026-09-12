import React from 'react';
import Hero from '../components/home/Hero';
import Service from '../components/home/Service';
import About from '../components/home/About';
import Pricing from '../components/home/Pricing';
import FAQ from '../components/home/FAQ';
import Footer from '../components/Footer';

function Home() {
  return (
    <main id="main-content" className='bg-[#FAF7F2] text-stone-900'>
      <div id="hero">
        <Hero />
      </div>
      <div id="service">
        <Service />
      </div>
      <div id="about">
        <About />
      </div>
      {/* <div id="pricing">
        <Pricing />
      </div> */}
      <div id="faq">
        <FAQ />
      </div>
    </main>
  );
}

export default Home;
