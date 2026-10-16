import { baseApi } from "../../utils/apiBaseQuery";

export const workspaceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllWorkSpace: builder.query({
            query: ({ status = "", page = 1, limit = 10, searchTerm = "" } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", String(page));
                if (limit) params.append("limit", String(limit));
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (status && status.toLowerCase() !== "all") {
                    params.append("status", status.toLowerCase());
                }
                const queryString = params.toString();
                return {
                    url: queryString ? `/chair-rentals?${queryString}` : "/chair-rentals",
                    method: "GET",
                };
            },
            providesTags: ["workspace"],
        }),
    }),
});

export const {
    useGetAllWorkSpaceQuery
} = workspaceApi;

