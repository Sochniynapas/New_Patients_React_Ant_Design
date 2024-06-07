import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  icdParams,
  patientsInspectionParams,
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
    }),
    getPatientsInspectionsList: build.query({
      query: ({
        token,
        id,
        grouped = false,
        icdRoots = [],
        page = 1,
        size = 5,
      }) => {
        const params = patientsInspectionParams(icdRoots, grouped, page, size)
        return {
          url: `api/patient/${id}/inspections?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
      providesTags: (result, id) => [{ type: "Inspections", id: "LIST" }],
    }),
    getIcdRoots: build.query({
      query: () => ({
        url: `api/dictionary/icd10/roots`,
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
  useGetPatientsInspectionsListQuery,
  useGetIcdRootsQuery,
} = patientsApi
