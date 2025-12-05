const { createSlice } = require("@reduxjs/toolkit");

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  },
  reducers: {
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { hideLoader, showLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
