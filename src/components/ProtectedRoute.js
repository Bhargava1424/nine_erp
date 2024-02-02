// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/Login2" replace state={{ from: location }} />;
  } else if (roles && !roles.includes(user.role)) {
    // User does not have the required role, redirect to home or a not authorized page
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute