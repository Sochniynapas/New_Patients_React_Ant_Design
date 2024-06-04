import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slice/authSlice'
import { userApi } from "../api/userApi";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        auth: authReducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware)

});
export default store