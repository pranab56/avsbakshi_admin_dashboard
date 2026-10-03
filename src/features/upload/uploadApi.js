import { baseApi } from '../../utils/apiBaseQuery';

export const uploadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        upload: builder.mutation({
            query: (formData) => ({
                url: "/media-uploads/upload",
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

// Export hooks
export const {
    useUploadMutation
} = uploadApi;
