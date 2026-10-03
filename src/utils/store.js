import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { baseApi } from "./apiBaseQuery";


const authResetMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  if (
    action.type === "auth/logout" ||
    action.type === "auth/setCredentials" ||
    action.type === "auth/setUser" ||
    action.type === "auth/setToken"
  ) {
    storeApi.dispatch(baseApi.util.resetApiState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authResetMiddleware),
});
