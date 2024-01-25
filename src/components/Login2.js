import React, { useState } from 'react';
import { useAuth } from '../services/authService';
import { Link } from 'react-router-dom';

function Login2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: authServiceLogin } = useAuth();
  let userRole = '';
  let userBranch = '';

  const handleLogin = (e) => {
    e.preventDefault();

    try {
      var SchoolManagementSystemApi = require('school_management_system_api');
      var api = new SchoolManagementSystemApi.AuthorizationApi();
      var body = new SchoolManagementSystemApi.LoginRequest();
      body.username = email;
      body.password = password;
      console.log(body);
      api.login(body, function (error, data, response) {
        if (error) {
          console.error('API Error:', error);
        } else {
          try {
            var responseBody = JSON.parse(response.text); // Assuming response.body is already in JSON format
            console.log(responseBody.message);
            console.log(responseBody.data.employeeRole);
            if (responseBody.message === 'Login Successful') {
              userRole = responseBody.data.employeeRole;
              userBranch = responseBody.data.employeeBranch
              localStorage.setItem('userRole', userRole);
              localStorage.setItem('userBranch', userBranch);
              authServiceLogin({ role: userRole, branch: userBranch }); 
            }
            else {
              alert(responseBody.message);
            }

          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }

    // // Sample admin and accountant credentials
    // const adminCredentials = { email: 'admin@example.com', password: '123' };
    // const accountantCredentials = { email: 'accountant@example.com', password: '123' };
    // const executiveCredentials = { email: 'executive@example.com', password: '123' };

    // Validation using regular expressions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || password.trim() === '') {
      alert('Invalid email or password format.');
      return;
    }


    // Check user credentials and set role
    // if (email === adminCredentials.email && password === adminCredentials.password) {
    //   userRole = 'Admin';
    // } else if (email === accountantCredentials.email && password === accountantCredentials.password) {
    //   userRole = 'Accountant';
    // } else if (email === executiveCredentials.email && password === executiveCredentials.password) {
    //   userRole = 'Executive';
    // } else {
    //   alert('Invalid credentials.');
    //   return;
    // }
    // Log in logic (you may want to use authentication libraries or APIs here)

    // Call the login function from authService
  };

  return (
    <div className="hero min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card shadow-md bg-base-100 p-6 w-96">
        <h1 className="text-3xl font-bold mb-4">Please Login To Continue...</h1>
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          {/* ... (rest of the form) */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="text-s text-black cursor-pointer mt-1"><Link to='/ForgotPassword'>Forgot password?</Link></label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login2;
