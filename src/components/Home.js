import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection2 from './HeroSection2';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/Login2');
    }
  }, [user, navigate]);

  return (
    <div className="main-container root-container" style={{ minHeight: '537px' }}>
      <Navbar />
      <HeroSection2 />                                                                                                     
      <Footer />
    </div>
  );
}

export default Home;
