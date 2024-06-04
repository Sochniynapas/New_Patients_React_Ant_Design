import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BASE_URL = 'https://mis-api.kreosoft.space/'



export const userApi = createApi({

    reducerPath: 'userApi',
    tagTypes: ['Profile'],
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
        registerNewUser: build.mutation({
            query: ({body}) => ({
                url: 'api/doctor/register',
                method: 'POST',
                body: body
            })
        }),
        authUser: build.mutation({
            query: ({body}) => ({
                url: 'api/doctor/login',
                method: 'POST',
                body: body
            })
        }),
        getSpecialtiesList: build.query({
            query:({name}) =>({
                url: `api/dictionary/speciality?name=${name}&page=1&size=5`,
            })
        })
    })
})

export const {
    useRegisterNewUserMutation,
    useGetSpecialtiesListQuery,
    useAuthUserMutation
} = userApi