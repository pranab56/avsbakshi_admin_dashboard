import { baseApi } from "../../utils/apiBaseQuery";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Appointments
    getAllAppointments: builder.query({
      query: ({
        searchTerm = "",
        page = 1,
        limit = 10,
        status = "",
        paymentStatus = "",
        professional = "",
        customer = "",
        salon = "",
      } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (status && status.toLowerCase() !== "all") {
          params.append("status", status.toLowerCase());
        }
        if (paymentStatus && paymentStatus.toLowerCase() !== "all") {
          params.append("paymentStatus", paymentStatus.toLowerCase());
        }
        if (professional) params.append("professional", professional);
        if (customer) params.append("customer", customer);
        if (salon) params.append("salon", salon);

        return {
          url: `/appointments?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Appointments"],
    }),
  }),
});

// Export hooks
export const { useGetAllAppointmentsQuery } = appointmentApi;
