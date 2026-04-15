import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import { SIGNUP } from '@/service/url';

export const signupUser = createAsyncThunk(
  'signup/signupUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(SIGNUP, payload);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  userdetails: null,
  user: getUserFromCookie(),
  token: getTokenFromCookie(),
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    clearSignupState: (state) => {
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userdetails = action.payload.data;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
      });
  },
});

export const { clearSignupState } = signupSlice.actions;
export default signupSlice.reducer;
