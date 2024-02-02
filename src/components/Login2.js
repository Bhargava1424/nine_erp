import React, { useState } from 'react';
import { useAuth } from '../services/authService';
import { Link } from 'react-router-dom';  
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
function Login2() {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: authServiceLogin } = useAuth();
  let userRole = '';
  let userBranch = '';;

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
              userBranch = responseBody.data.employeeBranch;
              // Fetch students based on the branch here
              const isManager = userRole==="Manager";
              const query = isManager?{"studentStatus": "Active"} : {"studentStatus": "Active", "branch": userBranch};
              try {
                var SchoolManagementSystemApi = require('school_management_system_api');
                var api = new SchoolManagementSystemApi.DbApi();
                const opts = {
                  body: {
                    "collectionName": "students",
                    "query": query,
                    "type": "findMany"
                  }
                };
        
                console.log("In Login",opts.body);
        
                api.dbGet(opts, function(error, data, response) {
                  if (error) {
                    console.error('API Error:', error);
                  } else {
                    try {
                      const responseBody = response.body; // Assuming response.body is already in JSON format
                      console.log("In login",responseBody);
                      
                      const studentsCount = responseBody.length; // This is an example, adjust based on actual API response structure
                      // Now call authServiceLogin with role, branch, and students count
                      authServiceLogin({ role: userRole, branch: userBranch, totalStudentCount:studentsCount }); 
                      navigate('/');
                    } catch (parseError) {
                      console.error('Error parsing response:', parseError);
                    }
                  }
                });
        
              } catch (error) {
                console.error("Error fetching data: ", error);
              }
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
  };
  

  

  return (
    <div>
      <Navbar/>
    <div className="hero min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card shadow-md bg-base-100 p-6 w-96">
      <img alt="logo" src="/9logo.webp" className="responsive-logo" />
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
    </div>
  );

}

export default Login2;
