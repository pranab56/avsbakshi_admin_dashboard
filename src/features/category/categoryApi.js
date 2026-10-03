import { baseApi } from "../../utils/apiBaseQuery";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => {
        return {
          url: "/categories/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["category"],
    }),

    getAllCategories: builder.query({
      query: (params = {}) => {
        return {
          url: "/categories",
          method: "GET",
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.searchTerm ? { searchTerm: params.searchTerm, search: params.searchTerm } : {}),
          },
        };
      },
      providesTags: ["category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
