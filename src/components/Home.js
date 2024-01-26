import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection2 from './HeroSection2';



function Home() {
  

  return (
    <div className="main-container">
      <Navbar />
        

      <div className="hero-container">
        <HeroSection2 />
      </div>
      <Footer />
    </div>
  );
}

export default Home;