import { createSlice } from "@reduxjs/toolkit";


const initialState={
    user:null,
    role:null,
    token:null,
    setLoading:false,
    error:null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginStart:(state)=>{
            console.log("Login process started");
            state.setLoading=true;
            state.error=null;
        },
        loginSuccess:(state,action)=>{
            state.setLoading=false;
            state.user=action.payload;
            state.role=action.payload.role;
            state.token=action.payload.token;
            localStorage.setItem("token", action.payload.token);
            console.log("Login successful, token stored in localStorage:", action.payload.token);
        },
        loginFailure:(state,action)=>{
            state.setLoading=false;
            state.error=action.payload;
        },
        logout:(state)=>{
            state.user=null;
            state.role=null;
            state.token=null;
            localStorage.removeItem("token");
            console.log("User logged out, token removed from localStorage");
        }
    }
})
export const {loginStart,loginSuccess,loginFailure,logout}=authSlice.actions;
export default authSlice.reducer
