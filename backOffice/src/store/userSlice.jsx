import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  display_name: null,
  token: null,
  role: null,
  email: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action) {
      const { username, display_name, token, role, email } = action.payload;
      state.username = username;
      state.display_name = display_name;
      state.token = token;
      state.role = role;
      state.email = email;
      state.isLoggedIn = true;
    },
    clearUserData(state) {
      state.username = null;
      state.display_name = null;
      state.token = null;
      state.role = null;
      state.email = null;
      state.isLoggedIn = false;
    },
  },
});


export const { setUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
