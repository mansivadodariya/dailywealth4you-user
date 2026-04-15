import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import { LOGIN, RESET_PASSWORD } from '@/service/url';
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(LOGIN, payload);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'login/resetPassword',
  async (payload, thunkApi) => {
    try {
      const authToken = payload?.token || getTokenFromCookie();
      const response = await api.put(
        RESET_PASSWORD,
        {
          oldPassword: payload?.oldPassword,
          newPassword: payload?.newPassword,
        },
        {
          headers: authToken
            ? {
                'x-auth-token': authToken,
              }
            : {},
        }
      );
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
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordData: null,
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
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        debugger;
        state.isLoading = false;
        state.error = null;

        const responseData = action.payload?.data || action.payload;

        const token = responseData?.token;
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
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = null;
        state.resetPasswordData = action.payload?.data || action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload || 'Reset password failed';
      });
  },
});

export const { logout, clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;
