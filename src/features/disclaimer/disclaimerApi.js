import { baseApi } from "../../utils/apiBaseQuery";

export const disclaimerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDisclaimer: builder.mutation({
      query: (data) => {
        return {
          url: "/disclaimers",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["disclaimer"],
    }),

    getDisclaimerByType: builder.query({
      query: (type) => {
        return {
          url: `/disclaimers/${type}`,
          method: "GET",
        };
      },
      providesTags: ["disclaimer"],
    }),
  }),
});

export const {
  useCreateDisclaimerMutation,
  useGetDisclaimerByTypeQuery,
  useLazyGetDisclaimerByTypeQuery,
} = disclaimerApi;
