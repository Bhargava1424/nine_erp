import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthCheck = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || user.role === undefined) {
      navigate('/');
    }
  }, [user, navigate]);

  return null; // This component does not render anything
};

export default AuthCheck;
