import { baseApi } from "../../utils/apiBaseQuery";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => {
                return {
                    url: "/users/me",
                    method: "GET",
                };
            },
            providesTags: ["profile"],
        }),

        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: "/users/me",
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["profile"],
        }),

        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/change-password",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["profile"],
        }),


    }),
});

export const {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = profileApi;

