import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection2 from './HeroSection2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  const user = useSelector((state) => state.auth.user); // Get user from Redux store or appropriate source

  return (
    <div className="main-container">
      <Navbar />
      {user && (
        <div className="container mx-auto mt-5 flex justify-center flex-nowrap gap-4">
          <div className="flex-1 min-w-max">
            <Link to='/AddStudent'>
              <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                <i className="fa fa-user-plus fa-3x"></i>
                <h3 className="mt-2">Add Student</h3>
              </div>
            </Link>
          </div>
          <div className="flex-1 min-w-max">
            <Link to='/AddReceipts'>
              <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                <i className="fa fa-plus fa-3x"></i>
                <h3 className="mt-2">Add Receipts</h3>
              </div>
            </Link>
          </div>

          {user.role === 'Manager' && (
            <>
              <div className="flex-1 min-w-max">
                <Link to='/AddEmployee'>
                  <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                    <i className="fa fa-user-secret fa-3x"></i>
                    <h3 className="mt-2">Add Employee</h3>
                  </div>
                </Link>
              </div>
              <div className="flex-1 min-w-max">
                <Link to='/AddBranch'>
                  <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                    <i className="fa fa-home fa-3x"></i>
                    <h3 className="mt-2">Add Branch</h3>
                  </div>
                </Link>
              </div>
            </>
          )}

          <div className="flex-1 min-w-max">
            <Link to='/ListReceipts'>
              <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                <i className="fa fa-list-alt fa-3x"></i>
                <h3 className="mt-2">List Receipts</h3>
              </div>
            </Link>
          </div>

          {(user.role === 'Manager' || user.role === 'Executive') && (
            <div className="flex-1 min-w-max">
              <Link to='/Concessions'>
                <div id="cardbox1" className="statistic-box flex items-center justify-center flex-col">
                  <i className="fa fa-tags fa-3x"></i>
                  <h3 className="mt-2">Concessions</h3>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
        <HeroSection2 />

      <Footer />
    </div>
  );
}

export default Home;
