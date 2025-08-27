import { configureStore } from "@reduxjs/toolkit";
import {authApi} from "./authApi";
import { quizeApi } from "./quizeApi";
import authReducer from "./authSlice";

export const store=configureStore({
    reducer:{
        auth:authReducer,
        [authApi.reducerPath]:authApi.reducer,
        [quizeApi.reducerPath]: quizeApi.reducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware().concat(authApi.middleware,quizeApi.middleware),
});

export default store;