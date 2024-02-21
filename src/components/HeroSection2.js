import { useSelector } from 'react-redux';
import AdminComponent from './AdminDashboardComponent';
import ExecutiveComponent from './ExecutiveDashboardComponent';
import AccountantComponent from './AccountantDashboardComponent';
import DirectorComponent from './DirectorDashboardCompnent';

function HeroSection2() {
  const userRole = useSelector((state) => state.auth.user?.role);

  // Save userRole to local storage
  localStorage.setItem('userRole', userRole);
  
  return (
    <div className="hero-section">   
      {userRole === 'Manager' && <AdminComponent/>}
      {userRole === 'Executive' && <ExecutiveComponent />}
      {userRole === 'Accountant' && <AccountantComponent />}
      {userRole === 'Director' && <DirectorComponent />}
    </div>  
  );
}

export default HeroSection2;
