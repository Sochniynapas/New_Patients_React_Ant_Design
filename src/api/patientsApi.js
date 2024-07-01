import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  patientsListParams,
} from "../helpers/navigate"

const BASE_URL = "https://mis-api.kreosoft.space/"

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  tagTypes: ["Patients", "Inspections"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    createPatient: build.mutation({
      query: ({ token, data }) => ({
        url: "api/patient",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: [{ type: "Patients", id: "LIST" }],
    }),
    getPatientCard: build.query({
      query: ({ token, id }) => ({
        url: `api/patient/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, id) => [{ type: "Inspections", id: "LIST" }],
    }),
    getIcdRoots: build.query({
      query: () => ({
        url: `api/dictionary/icd10/roots`,
      }),
    }),
    getIcd: build.query({
      query: ({request="", page=1, size=5}) => ({
        url: `api/dictionary/icd10?request=${request}&page=${page}&size=${size}`,
      }),
    }),
    getPatients: build.query({
      query: ({
        token,
        name,
        conclusions = [],
        sorting,
        scheduledVisits,
        onlyMine,
        page = 1,
        size = 5,
      }) => {
        const params = patientsListParams(
          name,
          conclusions,
          sorting,
          scheduledVisits,
          onlyMine,
          page,
          size
        )

        return {
          url: `api/patient?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      providesTags: (result, id) => [{ type: "Patients", id: "LIST" }],
    }),
  }),
})

export const {
  useGetPatientsQuery,
  useCreatePatientMutation,
  useGetPatientCardQuery,
  useGetIcdRootsQuery,
  useGetIcdQuery
} = patientsApi
