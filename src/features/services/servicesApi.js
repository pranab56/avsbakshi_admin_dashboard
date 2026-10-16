import { baseApi } from "../../utils/apiBaseQuery";

export const servicesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query({
            query: ({ status = "", page = 1, limit = 10, searchTerm = "" } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", String(page));
                if (limit) params.append("limit", String(limit));
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (status && status.toLowerCase() !== "all") {
                    params.append("status", status.toLowerCase());
                }
                return {
                    url: `/services/all?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["service"],
        }),
    }),
});

export const {
    useGetAllServicesQuery,
} = servicesApi;


