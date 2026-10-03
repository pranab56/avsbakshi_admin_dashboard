import { baseApi } from "../../utils/apiBaseQuery";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: (params = {}) => {
        return {
          url: "/transactions",
          method: "GET",
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
            ...(params.status ? { status: params.status } : {}),
            ...(params.gateway ? { gateway: params.gateway } : {}),
            ...(params.type ? { type: params.type } : {}),
          },
        };
      },
      providesTags: ["Transactions"],
    }),
  }),
});

// Export hooks
export const { useGetAllTransactionQuery } = transactionApi;

