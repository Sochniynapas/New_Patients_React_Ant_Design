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
        editProfile: build.mutation({
            query: ({body, token}) => ({
                url: 'api/doctor/profile',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: body
            }),
            invalidatesTags: [{ type: 'Profile', id: 'LIST' }]
        }),
        getProfile: build.query({
            query: ({token}) => ({
                url: 'api/doctor/profile',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            providesTags: (result, id) => [{ type: 'Profile', id: 'LIST' }]
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
    useAuthUserMutation,
    useGetProfileQuery,
    useEditProfileMutation
} = userApi