import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const AuthCheck = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const prevUser = usePrevious(user);

  useEffect(() => {
    // When user logs out (user becomes undefined and previously was defined)
    if (prevUser && !user) {
      navigate('/');
    }
  }, [user, prevUser, navigate]);

  return null; // This component does not render anything
};

export default AuthCheck;
