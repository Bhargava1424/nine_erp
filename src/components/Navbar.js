import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAddStudentReceiptPage = location.pathname.startsWith('/AddStudentReceipt'); 
  const handleLogoClick = (e) => {
    if (isAddStudentReceiptPage) {
      e.preventDefault();
      window.location.reload();
    }
  };

  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
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
      <div className="navbar-start"></div>
        {user ? (
          <div className="navbar-center logo-container">
            <Link to='/' onClick={handleLogoClick}>
              <img alt="logo" src="/9logo.webp" className="responsive-logo" />
            </Link>
          </div>
        ) : null}
        <div className="navbar-end">
          {user && !isAddStudentReceiptPage && (
            <div className="dropdown dropdown-end" ref={profileDropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className={`avatar group placeholder`}
                onClick={toggleProfileDropdown}
              >
                {user && (
                  <div
                    className={`w-10 h-10 rounded-full ring ring-offset-base-100 ring-offset-2 flex items-center justify-center text-white`}
                    style={{ backgroundColor: user.color }}
                  >
                    <span className="text-3xl">{user.role.charAt(0)}</span>
                  </div>
                )}
              </div>
              {isProfileDropdownOpen && (
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="divider custom-divider"></div>
    </>
  );
}

export default Navbar;
