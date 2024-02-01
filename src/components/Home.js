import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection2 from './HeroSection2';

function Home() {
  return (
    <div className="main-container  root-container" style={{ minHeight: '537px' }}>
      <Navbar />
      <HeroSection2 />
      <Footer />
    </div>
  );
}


export default Home;
