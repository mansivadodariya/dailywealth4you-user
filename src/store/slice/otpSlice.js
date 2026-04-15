import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import { FORGOT_PASSWORD, SEND_OTP, VERIFY_OTP } from '@/service/url';
import { toast } from 'react-toastify';

export const sendOtp = createAsyncThunk(
  'otp/sendOtp',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(SEND_OTP, payload);

      return response;
    } catch (error) {
      console.log(error);
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(VERIFY_OTP, payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'otp/forgotPassword',
  async (payload, thunkApi) => {
    try {
      const response = await api.put(FORGOT_PASSWORD, payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  sendOtpLoading: false,
  sendOtpError: null,
  sendOtpData: null,
  verifyOtpLoading: false,
  verifyOtpError: null,
  verifyOtpData: null,
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  forgotPasswordData: null,
};

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    clearOtpState: (state) => {
      state.sendOtpLoading = false;
      state.sendOtpError = null;
      state.sendOtpData = null;
      state.verifyOtpLoading = false;
      state.verifyOtpError = null;
      state.verifyOtpData = null;
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.sendOtpLoading = true;
        state.sendOtpError = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.sendOtpLoading = false;
        state.sendOtpError = null;
        state.sendOtpData = action.payload?.data || action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.sendOtpLoading = false;
        state.sendOtpError = action.payload || 'Failed to send OTP';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtpLoading = true;
        state.verifyOtpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyOtpLoading = false;
        state.verifyOtpError = null;
        state.verifyOtpData = action.payload?.data || action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtpLoading = false;
        state.verifyOtpError = action.payload || 'Failed to verify OTP';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = null;
        state.forgotPasswordData = action.payload?.data || action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError =
          action.payload || 'Failed to reset password';
      });
  },
});

export const { clearOtpState } = otpSlice.actions;
export default otpSlice.reducer;
