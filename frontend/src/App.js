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
function App() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    // Set up initial authentication state when the app loads
    if (user) {
      dispatch(login(user));
    } else {
      dispatch(logout());
    }
  }, [user, dispatch]);

  return (
<>
  <Router>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/AddStudent' element={<AddStudent />}></Route>
      <Route path='/AddReceipts' element={<AddReceipts />}></Route>
      <Route path='/ListReceipts' element={<ListReceipts />}></Route>
      <Route path='/Concessions' element={<Concessions />}></Route>
      <Route path='/Login2' element={<Login2 />}></Route>
      <Route path='/HeroSection2' element={<HeroSection2/>}></Route>
      <Route path='/AddBranch' element={<AddBranch />}></Route>
      <Route path='/AddEmployee' element={<AddEmployee />}></Route>
      <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
      <Route path='/DownloadReceipt' element={<DownloadReceipt />}></Route>
      <Route path="/AddStudentReceipt/:firstName" element={<AddStudentReceipt />}></Route>
    </Routes>
  </Router>  
  
</>
  );
}

export default App;
