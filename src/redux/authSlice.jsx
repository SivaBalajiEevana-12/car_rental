// src/redux/authSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadInitialState = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  
  if (token && role) {
    return {
      user: {
        id: userId || null,
        email: userEmail || null,
        name: userName || null
      },
      role: role,
      token: token,
      loading: false,
      error: null
    };
  }
  
  return {
    user: null,
    role: null,
    token: null,
    loading: false,
    error: null
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log("Login process started");
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      console.log("LoginSuccess payload:", action.payload);
      
      state.loading = false;
      // Store user data directly - NOT nested
      state.user = {
        id: action.payload.user?.id || action.payload.user_id,
        email: action.payload.user?.email || action.payload.email,
        name: action.payload.user?.name || action.payload.name
      };
      state.role = action.payload.role;
      state.token = action.payload.token;
      
      // Store in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("userEmail", state.user.email || "");
      localStorage.setItem("userName", state.user.name || "");
      localStorage.setItem("userId", state.user.id || "");
      
      console.log("Login successful - User:", state.user);
      console.log("Login successful - Role:", state.role);
      console.log("Login successful - Email:", state.user.email);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      
      console.log("User logged out, token removed from localStorage");
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;