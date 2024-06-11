import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slice/authSlice'
import { userApi } from "../api/userApi";
import { patientsApi } from "../api/patientsApi";
import { inspectionsApi } from "../api/inspectionsApi";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [patientsApi.reducerPath]: patientsApi.reducer,
        [inspectionsApi.reducerPath]: inspectionsApi.reducer,
        auth: authReducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware, patientsApi.middleware, inspectionsApi.middleware)

});
export default store