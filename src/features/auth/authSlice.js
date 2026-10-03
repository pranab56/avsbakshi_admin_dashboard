import { createSlice } from "@reduxjs/toolkit";
import { saveToken, saveRefreshToken, saveUser, removeStorage, getToken, getRefreshToken, getUser } from "../../utils/storage";

const initialState = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  user: getUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      saveToken(token);
      if (refreshToken) saveRefreshToken(refreshToken);
      saveUser(user);
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      removeStorage();
    },
  },
});

export const { hydrate, setToken, setUser, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
