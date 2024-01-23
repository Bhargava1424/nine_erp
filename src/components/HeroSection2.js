import { useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import AdminComponent from './AdminComponent';
import ExecutiveComponent from './ExecutiveComponent';
import AccountantComponent from './AccountantComponent';

function HeroSection2() {
  const userRole = useSelector((state) => state.auth.user?.role);

  return (
    <div className="hero-section">
      {!userRole && <LoginComponent />}
      {userRole === 'Admin' && <AdminComponent/>}
      {userRole === 'Executive' && <ExecutiveComponent />}
      {userRole === 'Accountant' && <AccountantComponent />}
    </div>
  );
}

export default HeroSection2;
