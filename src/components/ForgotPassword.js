import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Navbar from './Navbar';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStage, setCurrentStage] = useState('emailSubmission');
  const [passwordError, setPasswordError] = useState('');  
  const navigate = useNavigate();

// Function to retrieve user emails
const getUserEmails = (username) => {
  const emails=['hello@9ed.in', 'bharathteja@9ed.in', 'edunine001@gmail.com','kundannanubala@gmail.com'];
    if (username === 'admin@example.com') {
      return emails;
    }
    // Add more cases for different users if needed
    return [];
  };
  
  // Handle Email Submission
  const handleEmailSubmission = (e) => {
    e.preventDefault();
    const emails = getUserEmails(email);
    if (emails.length > 0) {
      const code = Math.random().toString(36).substr(2, 6) + '$#';
      setGeneratedCode(code); // Store the generated code
      sendResetCode(emails, code);
      setCurrentStage('codeVerification');
    } else {
      alert('Email not found.');
    }
  };
  
  // Send Reset Code using EmailJS
  const sendResetCode = (emails, code) => {
    const emailParams = {
    to_name: 'User',
    reset_code: `Your password reset code is: ${code}`,
    from_name: "9 Education",
    to_email: emails.join(', '),
    };
    console.log(emailParams);
    // Note: The user ID is passed during the initialization of EmailJS, not in the send function.
    emailjs.send('service_kw06l9q', 'template_xi7iwq3', emailParams,'1NzuxZpLM8L5COxYf')
      .then(response => {
        console.log('Email sent successfully', response.status, response.text);
        setCurrentStage('codeVerification');
      })
      .catch(err => {
        console.error('Failed to send email', err);
        // Handle errors here, such as updating the state to show an error message to the user
      });
  };
  
  

  // Handle Code Verification
const handleCodeVerification = (e) => {
    e.preventDefault();
    if (resetCode === generatedCode) {
      setCurrentStage('passwordReset');
    } else {
      alert('Incorrect code. Please try again.');
    }
  };
  
  // Handle Password Reset
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    // Simulate password update
    alert('Password has been reset successfully. Redirecting to login...');
    navigate('/');
  };

  return (
    <div className="forgot-password-container">
        <Navbar/>
      {currentStage === 'emailSubmission' && (
        // Email Submission Form
<div className="flex items-center justify-center min-h-screen bg-gray">
  <form onSubmit={handleEmailSubmission} className="border border-gray-300 rounded-lg bg-gray p-6 space-y-4 max-w-md mx-auto">
    <h1 className="text-1xl mb-4">Forgot Your Password? The reset link is sent to 'hello@9ed.in', 'bharathteja@9ed.in', 'edunine001@gmail.com'  .</h1>
    <div className="flex flex-col">
      <label className="text-sm mb-1">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="input input-bordered w-full"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <button type="submit"  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
      Send Email
    </button>
  </form>
</div>


      )}
      {currentStage === 'codeVerification' && (
        // Code Verification Form
<div className="flex items-center justify-center min-h-screen bg-gray">
  <form onSubmit={handleCodeVerification} className="border border-gray-300 rounded-lg bg-gray p-6 space-y-4 max-w-md mx-auto">
    <h1 className="text-3xl font-bold mb-4">Enter Your Reset Code</h1>
    <div className="flex flex-col">
      <label className="text-sm mb-1">Reset Code</label>
      <input
        type="text"
        placeholder="Enter the code"
        className="input input-bordered w-full"
        required
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
      />
    </div>
    <button type="submit"  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
      Verify Code
    </button>
  </form>
</div>

      )}
      {currentStage === 'passwordReset' && (
        // Password Reset Form
<div className="flex items-center justify-center min-h-screen bg-gray">
  <form onSubmit={handlePasswordReset} className="border border-gray-300 rounded-lg bg-gray p-6 space-y-4 max-w-md mx-auto">
    <h1 className="text-3xl font-bold mb-4">Set Your New Password</h1>
    <div className="flex flex-col">
      <label className="text-sm mb-1">New Password</label>
      <input
        type="password"
        placeholder="New password"
        className="input input-bordered w-full"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm mb-1">Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm password"
        className="input input-bordered w-full"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
    </div>
    <button type="submit"  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
      Reset Password
    </button>
  </form>
</div>

      )}
    </div>
  );
}

export default ForgotPassword;
