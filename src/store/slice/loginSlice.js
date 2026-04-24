import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import { ADMIN_LOGIN, LOGIN, RESET_PASSWORD, UPDATE_USER } from '@/service/url';
import { toast } from 'react-toastify';

const getRoleFromUser = (user) =>
  user?.role ??
  user?.roleId ??
  user?.payload?.role ??
  user?.payload?.roleId ??
  null;

const getRoleFromResponse = (responseData, user) =>
  responseData?.role ??
  responseData?.roleId ??
  responseData?.payload?.role ??
  responseData?.payload?.roleId ??
  responseData?.data?.role ??
  responseData?.data?.roleId ??
  getRoleFromUser(user);

const initialUser = getUserFromCookie();

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

export const adminLoginUser = createAsyncThunk(
  'login/adminLoginUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(ADMIN_LOGIN, payload);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'login/updateUserProfile',
  async (payload, thunkApi) => {
    try {
      const { id, ...body } = payload;
      const response = await api.put(`${UPDATE_USER}?id=${id}`, body);
      return response;
    } catch (error) {
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
  user: initialUser,
  token: getTokenFromCookie(),
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordData: null,
  updateProfileLoading: false,
  updateProfileError: null,
  role: getRoleFromUser(initialUser),
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      clearAuthCookies();
    },
    clearLoginState: (state) => {
      state.error = null;
      state.isLoading = false;
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordData = null;
      state.updateProfileLoading = false;
      state.updateProfileError = null;
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
        const payloadData =
          responseData?.payload || responseData?.data || responseData;

        const token = payloadData?.token || responseData?.token;
        const user =
          payloadData?.user ||
          payloadData ||
          responseData?.user ||
          responseData ||
          null;

        const savedUser =
          user && typeof user === 'object'
            ? { ...user, token: undefined }
            : user;

        state.token = token;
        state.user = savedUser;
        state.role = getRoleFromResponse(responseData, savedUser);

        setAuthCookies({ token, user: savedUser });
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(adminLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const responseData = action.payload?.data || action.payload;
        const payloadData =
          responseData?.payload || responseData?.data || responseData;

        const token = payloadData?.token || responseData?.token;
        const user =
          payloadData?.user ||
          payloadData ||
          responseData?.user ||
          responseData ||
          null;

        const savedUser =
          user && typeof user === 'object'
            ? { ...user, token: undefined }
            : user;

        state.token = token;
        state.user = savedUser;
        state.role = getRoleFromResponse(responseData, savedUser);

        setAuthCookies({ token, user: savedUser });
      })
      .addCase(adminLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Admin login failed';
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
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = null;
        // Merge updated fields into user state and cookie
        const updated =
          action?.payload?.payload?.data ||
          action?.payload?.data ||
          action?.payload;
        if (updated && typeof updated === 'object') {
          state.user = { ...state.user, ...updated };
          setAuthCookies({ token: state.token, user: state.user });
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload || 'Failed to update profile';
      });
  },
});

export const { logout, clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;
