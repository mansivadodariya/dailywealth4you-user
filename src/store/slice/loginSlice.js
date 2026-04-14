import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import { LOGIN } from '@/service/url';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(LOGIN, payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  user: getUserFromCookie(),
  token: getTokenFromCookie(),
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuthCookies();
    },
    clearLoginState: (state) => {
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const responseData = action.payload?.data || action.payload;
        const token =
          responseData?.token ||
          responseData?.accessToken ||
          responseData?.jwt ||
          null;
        const user =
          responseData?.user ||
          responseData?.data?.user ||
          responseData ||
          null;

        state.token = token;
        state.user = user;
        setAuthCookies({ token, user });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;
