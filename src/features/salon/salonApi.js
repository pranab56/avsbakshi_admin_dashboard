import { baseApi } from "../../utils/apiBaseQuery";

export const salonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllsalons: builder.query({
            query: ({ status = "", page = 1, limit = 10, searchTerm = "" } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", String(page));
                if (limit) params.append("limit", String(limit));
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (status && status.toLowerCase() !== "all") {
                    params.append("status", status.toLowerCase());
                }
                return {
                    url: `/salons?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["salon"],
        }),

        updateSalonStatus: builder.mutation({
            query: ({ id, data, status }) => {
                return {
                    url: `/salons/${id}/status`,
                    method: "PATCH",
                    body: data || { status },
                };
            },
            invalidatesTags: ["salon"],
        }),

    }),
});

export const {
    useGetAllsalonsQuery,
    useUpdateSalonStatusMutation,
} = salonApi;

export const useGetAllSalonsQuery = useGetAllsalonsQuery;

