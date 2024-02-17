import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './services/authService';
import { login, logout } from './reducers/authReducer';
import './App.css';
import Home from "./components/Home";
import AddStudent from './components/AddStudent';
import AddReceipts from './components/AddReceipts';
import ListReceipts from './components/ListReceipts';
import Concessions from './components/Concessions';
import Login2 from './components/Login2';
import HeroSection2 from './components/HeroSection2';
import AddBranch from './components/AddBranch';
import AddEmployee from './components/AddEmployee';
import ForgotPassword from './components/ForgotPassword';
import AddStudentReceipt from './components/AddStudentReceipt';
import DownloadReceipt from './components/DownloadReceipt';
import AddStudentConcession from './components/AddStudentConcession';
import ProtectedRoute from './components/ProtectedRoute';  

function App() {

  const dispatch = useDispatch();
  const INACTIVITY_TIME = 1000 * 60 * 30; // 30 minutes in milliseconds

  useEffect(() => {
    // Check for user in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(login(user));
    } else {
      dispatch(logout());
    }

    let inactivityTimer;

    const logoutUser = () => {
      console.log("User has been inactive for 15 minutes, logging out.");
      dispatch(logout());
      localStorage.removeItem('user');
      window.location.href = '/Login2'; // Redirect to login page
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutUser, INACTIVITY_TIME);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer(); // Reset timer on component mount

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [dispatch]);


  return (
<div>
  <Router>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/AddStudent' element={<ProtectedRoute><AddStudent /></ProtectedRoute> }></Route>
      <Route path='/AddReceipts' element={<ProtectedRoute><AddReceipts /></ProtectedRoute>}></Route>
      <Route path='/ListReceipts' element={<ProtectedRoute><ListReceipts /></ProtectedRoute>}></Route>
      <Route path='/Concessions' element={< ProtectedRoute roles={['Manager','Executive']}><Concessions /></ProtectedRoute>}></Route>
      <Route path='/Login2' element={<Login2 />}></Route>
      <Route path='/HeroSection2' element={<HeroSection2/>}></Route>
      <Route path='/AddBranch' element={<ProtectedRoute roles={['Manager']}><AddBranch /></ProtectedRoute>}></Route>
      <Route path='/AddEmployee' element={<ProtectedRoute roles={['Manager']}><AddEmployee /></ProtectedRoute>}></Route>
      <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
      <Route path='/DownloadReceipt' element={<ProtectedRoute><DownloadReceipt /></ProtectedRoute>}></Route>
      <Route path="/AddStudentReceipt" element={<ProtectedRoute><AddStudentReceipt /></ProtectedRoute>}></Route> 
      <Route path="/AddStudentConcession" element={<ProtectedRoute><AddStudentConcession /></ProtectedRoute>} />

    </Routes>
  </Router>  
  
</div>
  );
}

export default App;
