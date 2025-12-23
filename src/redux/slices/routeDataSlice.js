// redux/slices/routeDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: {}, // { [key]: any }
};

const routeDataSlice = createSlice({
  name: "routeData",
  initialState,
  reducers: {
    setRouteData(state, action) {
      const { key, data } = action.payload;
      state.store[key] = data;
    },

    clearRouteData(state, action) {
      const key = action.payload;
      if (key) {
        delete state.store[key];
      }
    },

    clearAllRouteData(state) {
      state.store = {};
    },
  },
});

export const { setRouteData, clearRouteData, clearAllRouteData } = routeDataSlice.actions;

export default routeDataSlice.reducer;
