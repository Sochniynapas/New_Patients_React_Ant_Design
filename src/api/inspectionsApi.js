import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { patientsInspectionParams } from "../helpers/navigate"

const BASE_URL = "https://mis-api.kreosoft.space/"

export const inspectionsApi = createApi({
  reducerPath: "inspectionsApi",
  tagTypes: ["Inspections", "Inspection", "Comments"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    createInspection: build.mutation({
      query: ({ patientId, data, token }) => ({
        url: `api/patient/${patientId}/inspections`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Inspections", id: "LIST" }],
    }),
    redactInspection: build.mutation({
      query: ({ id, data, token }) => ({
        url: `api/inspection/${id}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Inspection", id: "LIST" }],
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
    getInspectionsChain: build.query({
      query: ({
        token,
        id
      }) => {
        return {
          url: `api/inspection${id}/chain`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      },
    }),
    getPrevInspectionsList: build.query({
      query: ({ id, request = "", token }) => ({
        url: `api/patient/${id}/inspections/search?request=${request}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, id) => [{ type: "Inspections", id: "LIST" }],
    }),
    getInspectionDetails: build.query({
      query: ({ id, token }) => ({
        url: `api/inspection/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, id) => [{ type: "Inspection", id: "LIST" }],
    }),
    getConsultationDetails: build.query({
      query: ({ id, token }) => ({
        url: `api/consultation/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result, id) => [{ type: "Comments", id: "LIST" }],
    }),
    postNewComment: build.mutation({
      query: ({ data, id, token }) => ({
        url: `api/consultation/${id}/comment`,
        method: 'POST',
        body: data,
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }),
      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),
    redactComment: build.mutation({
      query: ({ data, id, token }) => ({
        url: `api/consultation/comment/${id}`,
        method: 'PUT',
        body: data,
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }),
      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),
  }),
})

export const {
  useCreateInspectionMutation,
  useGetPatientsInspectionsListQuery,
  useGetPrevInspectionsListQuery,
  useGetInspectionDetailsQuery,
  useGetConsultationDetailsQuery,
  usePostNewCommentMutation,
  useRedactCommentMutation,
  useRedactInspectionMutation,
  useGetInspectionsChainQuery
} = inspectionsApi
