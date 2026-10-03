import { baseApi } from '../../utils/apiBaseQuery';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // 2. Forgot Password Email (Generate OTP)
    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/generate-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    // 3. Verify Email / OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // 4. Resend OTP
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/generate-otp",
        method: "POST",
        body: data,
      }),
    }),

    // 5. Reset Password
    resetPassword: builder.mutation({
      query: ({ token, data }) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;


