import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { patientsInspectionParams } from "../helpers/navigate"


const BASE_URL = "https://mis-api.kreosoft.space/"

export const inspectionsApi = createApi({
  reducerPath: "inspectionsApi",
  tagTypes: ["Inspections"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
        createInspection: build.mutation({
            query: ({patientId, data, token}) =>({
                url: `api/patient/${patientId}/inspections`,
                method: "POST", 
                body: data,
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }),
            invalidatesTags: [{ type: "Inspections", id: "LIST" }],
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
        getPrevInspectionsList: build.query({
            query: ({id, request = "", token}) => ({
                url: `api/patient/${id}/inspections/search?request=${request}`,
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }),
            providesTags: (result, id) => [{ type: "Inspections", id: "LIST" }],
        })

  })
})

export const {
    useCreateInspectionMutation,
    useGetPatientsInspectionsListQuery,
    useGetPrevInspectionsListQuery
  } = inspectionsApi