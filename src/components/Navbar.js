import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';


function Navbar() {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();  
  




  // Check if the current pathname is '/AddStudentReceipt'
  const isAddStudentReceiptPage = location.pathname.startsWith('/AddStudentReceipt'); 
  const handleLogoClick = (e) => {
    if (isAddStudentReceiptPage) {
      e.preventDefault();
      window.location.reload();
    }
  };
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAddAttributeDropdownOpen, setAddAttributeDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        // Click outside the dropdowns, close both dropdowns
        setDropdownOpen(false);
        setProfileDropdownOpen(false);
        setAddAttributeDropdownOpen(false);
      }
    };

    // Attach the event listener
    window.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    // Check if profile dropdown is open, if so, close it
    if (isProfileDropdownOpen) {
      setProfileDropdownOpen(false);
    }
    if (isAddAttributeDropdownOpen){
      setAddAttributeDropdownOpen(false);
    }
    // Toggle the state of the main dropdown
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    // Check if main dropdown is open, if so, close it
    if (isDropdownOpen) {
      setDropdownOpen(false);
    }
    if (isAddAttributeDropdownOpen){
      setAddAttributeDropdownOpen(false);
    }
    // Toggle the state of the profile dropdown
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleAddAttributeDropdown = () => {
    // Toggle the state of the AddAttribute dropdown
    setAddAttributeDropdownOpen(!isAddAttributeDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      <div className="navbar bg-base-100 custom-navbar-padding">
        <div className="navbar-start">
          {user && !isAddStudentReceiptPage && (
            <div className="dropdown relative" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={toggleDropdown}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              {isDropdownOpen && (
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to='/'>Home</Link></li>
                  <li><Link to='/AddStudent'>Add Student</Link></li>
                  
                  {(user.role === 'Manager') && (
                    <li className="dropdown dropdown-right">
                      <div
                        tabIndex={0}
                        role="button"
                        onClick={toggleAddAttributeDropdown}
                      >
                        AddAttribute
                      </div>
                      {isAddAttributeDropdownOpen && (
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li><Link to='/AddEmployee'>Add Employee</Link></li>                      
                          <li><Link to='/AddBranch'>Add Branch</Link></li>
                        </ul>
                      )}
                    </li>
                  )}
                  <li><Link to='/AddReceipts'>Add Receipts</Link></li>
                  <li><Link to='/ListReceipts'>List Receipts</Link></li>
                  {(user.role === 'Manager' || user.role === 'Executive') && <li><Link to='/Concessions'>Concessions</Link></li>}
                </ul>
              )}
            </div>
          )}
        </div>
        {user ? (
        <div className="navbar-center logo-container">
    <Link to='/' onClick={handleLogoClick}>
        <img alt="logo" src="/9logo.webp" className="responsive-logo" />
    </Link>


        </div>) : null}
        <div className="navbar-end">
          {user && !isAddStudentReceiptPage && (
            <div className="dropdown dropdown-end" ref={profileDropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className={`avatar group placeholder`}
                onClick={toggleProfileDropdown}
              >
                {user ? (
                  <div
                    className={`w-10 h-10 rounded-full ring ring-offset-base-100 ring-offset-2 flex items-center justify-center text-white`}
                    style={{ backgroundColor: user.color }}
                  >
                    <span className="text-3xl">{user.role.charAt(0)}</span>
                  </div>
                ) : null}
              </div>
              {isProfileDropdownOpen && (
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li>Profile</li>
                  <li>Settings</li>
                  <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                </ul>)}
            </div>
          )}
        </div>
      </div>
      <div className="divider custom-divider"></div>
    </>
  );
}

export default Navbar;
