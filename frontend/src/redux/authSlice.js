import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    company : null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload?.user || null;
      state.company = action.payload?.company || null; 
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.company = null;
    },
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;

// 🔥 THIS LINE WAS MISSING
export default authSlice.reducer;
