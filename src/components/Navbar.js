import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAddStudentReceiptPage = location.pathname.startsWith('/AddStudentReceipt'); 
  const handleLogoClick = (e) => {
    if (isAddStudentReceiptPage) {
        e.preventDefault();
        window.history.back();
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
                  <li onClick={handleLogout} className="btn btn-outline text-white" style={{ backgroundColor: '#00A0E3' }}>Logout</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="divider custom-divider"></div>
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
    </>
  );
}

export default Navbar;
