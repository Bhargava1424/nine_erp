// src/reducers/authReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: '', // Add role
  branch: '' // Add branch
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role; // Set role
      state.branch = action.payload.branch; // Set branch
    },
    logout: (state) => {
      state.user = null;
      state.role = ''; // Reset role
      state.branch = ''; // Reset branch
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
