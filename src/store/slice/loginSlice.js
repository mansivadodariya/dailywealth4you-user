import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import {
  ADMIN_LOGIN,
  LOGIN,
  RESET_PASSWORD,
  UPDATE_USER,
  GET_ALL_NOTIFICATION,
  UPDATE_NOTIFICATION,
  GET_ALL_USERS,
} from '@/service/url';
import toast from 'react-hot-toast';

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

const toNumericBalance = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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

export const fetchNotifications = createAsyncThunk(
  'login/fetchNotifications',
  async (_, thunkApi) => {
    try {
      const response = await api.get(GET_ALL_NOTIFICATION);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// Mark all as read — PUT /notification/updateNotification?id=null&isReadAll=true
export const updateNotification = createAsyncThunk(
  'login/updateNotification',
  async (_, thunkApi) => {
    try {
      const response = await api.put(
        `${UPDATE_NOTIFICATION}?id=null&isReadAll=true`,
        { isRead: true }
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// Fetch full user profile by ID — GET /user/getAllUsers?id=&page=1&limit=50
// Used after login and after profile update to get the latest profileUrl
export const fetchUserById = createAsyncThunk(
  'login/fetchUserById',
  async (userId, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ALL_USERS}?id=${userId}&page=1&limit=50`
      );
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
  notifications: [],
  notificationsLoading: false,
  unreadCount: 0,
  walletBalance: null,
  userLoading: false,
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
    // Called by socket when a new notification arrives
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      state.unreadCount = 0;
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
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.notifications = payload?.data || payload || [];
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationsLoading = false;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.userLoading = true;
      })
      // fetchUserById — merges full user data (including profileUrl) into state
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const payload = action?.payload?.payload || action?.payload;

        const data = payload?.data;

        // ✅ correct: first user record
        const userRecord = Array.isArray(data) ? data[0] : data;

        if (userRecord) {
          const normalizedWalletBalance = toNumericBalance(
            userRecord.walletBalance
          );
          state.walletBalance = normalizedWalletBalance;

          state.user = {
            ...state.user,
            ...userRecord,
            walletBalance: normalizedWalletBalance,
          };

          // setAuthCookies({
          //   token: state.token,
          //   user: state.user,
          // });
        }
      });
  },
});

export const { logout, clearLoginState, addNotification, markAllRead } =
  loginSlice.actions;
export default loginSlice.reducer;
