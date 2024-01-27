import { useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import AdminComponent from './AdminDashboardComponent';
import ExecutiveComponent from './ExecutiveDashboardComponent';
import AccountantComponent from './AccountantDashboardComponent';

function HeroSection2() {
  const userRole = useSelector((state) => state.auth.user?.role);

  // Save userRole to local storage
  localStorage.setItem('userRole', userRole);
  
  return (
    <div className="hero-section">   


      {!userRole && <LoginComponent />}
      {userRole === 'Manager' && <AdminComponent/>}
      {userRole === 'Executive' && <ExecutiveComponent />}
      {userRole === 'Accountant' && <AccountantComponent />}
    </div>  
  );
}

export default HeroSection2;
