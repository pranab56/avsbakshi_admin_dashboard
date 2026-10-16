import { baseApi } from "../../utils/apiBaseQuery";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get All Users
        getAllUsers: builder.query({
            query: ({ searchTerm = "", page, status = "", role = "", limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", String(page));
                if (limit) params.append("limit", String(limit));
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (status && status !== "all") params.append("status", status);
                if (role && role !== "all") params.append("role", role);

                return {
                    url: `/users/all?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Users"],
        }),

        // 2. Update User Status
        updateStatus: builder.mutation({
            query: ({ userId, status }) => ({
                url: `/users/${userId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllUsersQuery,
    useUpdateStatusMutation,
} = usersApi;
