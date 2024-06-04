import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        name: null,

    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload
        },
        clearToken(state) {
            state.token = null
        },
        setName(state, action){
            state.name = action.payload
        }
    }
})

export const { setToken, clearToken, setName } = authSlice.actions
export const selectToken = (state) => state.auth.token
export const selectname = (state) => state.auth.name

export default authSlice.reducer