import { createSlice } from "@reduxjs/toolkit";

//This state will hold the current user's data
const initialState = {
  name: null,
  email: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { name, token, role, email } = action.payload;
      state.name = name;
      state.token = token;
      state.role = role;
      state.email = email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
