import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { patientsListParams } from "../helpers/navigate"

const BASE_URL = 'https://mis-api.kreosoft.space/'



export const patientsApi = createApi({

    reducerPath: 'patientsApi',
    tagTypes: ['Patients'],
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
        getPatients: build.query({
            query: ({ token, name, conclusions = [], sorting, scheduledVisits, onlyMine, page = 1, size = 5 }) => {
                
                const params = patientsListParams(name, conclusions, sorting, scheduledVisits, onlyMine, page, size) 

                return {
                    url: `api/patient?${params.toString()}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            },
            providesTags: (result, id) => [{ type: 'Patients', id: 'LIST' }]

        }),
    })
})

export const {
    useGetPatientsQuery
} = patientsApi