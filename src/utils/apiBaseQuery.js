import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from '../features/auth/authSlice';
import { baseURL } from './BaseURL';
import { getToken } from './storage';

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1`,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token && !headers.get("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Inspect the error payload to decide if this is an auth failure
    const errData = result.error.data;
    let msg = '';
    try {
      if (errData) {
        if (typeof errData === 'string') msg = errData;
        else if (typeof errData === 'object') msg = JSON.stringify(errData);
      }
    } catch {
      msg = '';
    }

    const lower = String(msg).toLowerCase();
    const authKeywords = ['token', 'jwt', 'unauthoriz', 'not authenticated', 'invalid token', 'session expired', 'token expired'];
    const looksLikeAuthError = authKeywords.some(k => lower.includes(k));

    if (looksLikeAuthError) {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        try {
          window.location.href = "/auth/login";
        } catch {

        }
      }
    } else {

    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Users", "Appointments", "Transactions", "profile", "category", "disclaimer", "faq"],
});


