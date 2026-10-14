import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        overview: builder.query({
            query: () => ({
                url: "/analytics/overview/admin",
                method: "GET",
            }),
            providesTags: ["analytics"],
        }),

        userGroth: builder.query({
            query: (params = {}) => {
                const queryParams = {};
                if (params?.year) queryParams.year = params.year;
                const tz = params?.timezone || params?.timeZone;
                if (tz) queryParams.timezone = tz;
                return {
                    url: `/analytics/users-growth`,
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: ["analytics"],
        }),
    }),
});

// Export hooks
export const {
    useOverviewQuery,
    useUserGrothQuery,
} = overviewApi;

export const useUserGrowthQuery = useUserGrothQuery;
