// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ userName, uPassword }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         'https://ncapi.jainaindia.com/api/users/login',
//         {
//           userName: userName.trim(),
//           uPassword: uPassword.trim(),
//         }
//       );

//       const data = response.data;

//       if (data.returnCode === 1 && data.token) {
//         const user = {
//           userID: data.userID,
//           roleID: data.roleID,
//           roleName: data.roleName,
//           userName: data.userName,
//           sF_ID: data.sF_ID,
//           cat_MapID: data.cat_MapID,
//           asmid: data.asmid,
//           branch_ID: data.branch_ID,
//           token: data.token,
//         };

//         localStorage.setItem('userData', JSON.stringify(user));
//         return user;
//       } else {
//         return rejectWithValue(data.message || 'Login failed');
//       }
//     } catch (error) {
//       return rejectWithValue('Network Error');
//     }
//   }
// );
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ userName, uPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://ncapi.jainaindia.com/api/users/login',
        {
          userName: userName.trim(),
          uPassword: uPassword.trim(),
        }
      );

      const data = response.data;

      if (data.returnCode === 1 && data.token) {
        const user = {
          userID: data.userID,
          roleID: data.roleID,
          roleName: data.roleName,
          userName: data.userName,
          sF_ID: data.sF_ID,
          cat_MapID: data.cat_MapID,
          asmid: data.asmid,
          branch_ID: data.branch_ID,
          token: data.token,
        };

        localStorage.setItem('userData', JSON.stringify(user));
        return user;
      } else {
        // ❌ invalid credentials (handled by API)
        return rejectWithValue(data.message || 'Login failed');
      }
    } catch (error) {
      // ✅ network/server error vs API error
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Network Error');
    }
  }
);

const getUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromLocalStorage(), // ✅ hydrate from localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userData');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;