import { baseApi } from "../../utils/apiBaseQuery";

export const platfromApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatfrom: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updatePlatfrom: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useGetPlatfromQuery,
  useUpdatePlatfromMutation,
} = platfromApi;

// Aliases with corrected spelling for convenience
export const useGetPlatformQuery = platfromApi.endpoints.getPlatfrom.useQuery;
export const useUpdatePlatformMutation = platfromApi.endpoints.updatePlatfrom.useMutation;
