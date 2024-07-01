import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { consultationsParams } from "../helpers/navigate"

const BASE_URL = "https://mis-api.kreosoft.space/"

export const consultationsApi = createApi({
  reducerPath: "consultationsApi",
  tagTypes: ["Consultations"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    getConsultationsList: build.query({
      query: ({
        token,
        grouped = false,
        icdRoots = [],
        page = 1,
        size = 5,
      }) => {
        const params = consultationsParams(icdRoots, grouped, page, size)
        return {
          url: `api/consultation?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      providesTags: (result, id) => [{ type: "Consultations", id: "LIST" }],
    }),
  }),
})

export const {
  useGetConsultationsListQuery,
} = consultationsApi
