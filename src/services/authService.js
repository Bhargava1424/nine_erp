// authService.js
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../frontend/src/reducers/authReducer';

export const useAuth = () => {
  const dispatch = useDispatch();
  // Define getRandomColor function within authService.js
  const getRandomColor = () => {
    const colors = ['#2D5990', '#00A0E3'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  // Check if there is any stored user data in localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Use the stored user data as the initial state, or null if not present
  const initialState = storedUser || null;

  // Use the useSelector hook to get the user from the Redux store
  const userInStore = useSelector((state) => state.auth.user);

  // Use the initialState only if the userInStore is null
  const user = userInStore || initialState;

  const loginHandler = (userData) => {
        // Generate a random color for the user
        const userColor = getRandomColor();

        // Add color to the userData
        const updatedUserData = { ...userData, color: userColor };
    
        dispatch(login(updatedUserData));
        localStorage.setItem('user', JSON.stringify(updatedUserData));  };

  const logoutHandler = () => {
    dispatch(logout());
    
  };

  return {
    user,
    login: loginHandler,
    logout: logoutHandler,
  };
};
