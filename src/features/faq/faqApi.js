import { baseApi } from "../../utils/apiBaseQuery";

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFaq: builder.query({
            query: () => {
                return {
                    url: "/faqs",
                    method: "GET",
                };
            },
            providesTags: ["faq"],
        }),

        createFaq: builder.mutation({
            query: (data) => {
                return {
                    url: "/faqs/create",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["faq"],
        }),

        updateFaq: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/faqs/${id}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["faq"],
        }),

        deleteFaq: builder.mutation({
            query: ({ id }) => {
                return {
                    url: `/faqs/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["faq"],
        }),

    }),
});

export const {
    useGetFaqQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;

