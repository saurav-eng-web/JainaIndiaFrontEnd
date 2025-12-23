// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import loaderReducer from "./slices/loaderSlice";
import routeDataReducer from "./slices/routeDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    routeData: routeDataReducer,
  },
});
