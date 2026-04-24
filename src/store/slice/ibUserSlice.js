import api from '@/service/api';
import {
  APPLY_IB_REQUEST,
  GET_IB_PROFIT_SHARING,
  GET_ALL_IB_USER_REQUEST,
} from '@/service/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const applyIbRequest = createAsyncThunk(
  'ibUser/applyIbRequest',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(APPLY_IB_REQUEST, payload);
      toast.success(
        response?.data?.message || 'IB Request applied successfully.'
      );
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIbUserRequest = createAsyncThunk(
  'ibUser/fetchIbUserRequest',
  async (userId, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ALL_IB_USER_REQUEST}?userId=${userId}`
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIbProfitSharing = createAsyncThunk(
  'ibUser/fetchIbProfitSharing',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`${GET_IB_PROFIT_SHARING}${query}`);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

const ibUserSlice = createSlice({
  name: 'ibUser',
  initialState: {
    loading: false,
    error: null,
    // IB request status
    ibRequestStatus: null, // 'pending' | 'approved' | 'rejected' | null
    ibRequestLoading: false,
    ibRequestError: null,
    // IB Profit Sharing
    profitSharingSummary: null,
    profitSharingData: [],
    profitSharingCount: 0,
    profitSharingLoading: false,
    profitSharingError: null,
  },
  reducers: {
    clearIbUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.ibRequestStatus = null;
      state.ibRequestLoading = false;
      state.ibRequestError = null;
      state.profitSharingSummary = null;
      state.profitSharingData = [];
      state.profitSharingCount = 0;
      state.profitSharingLoading = false;
      state.profitSharingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // applyIbRequest
      .addCase(applyIbRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyIbRequest.fulfilled, (state) => {
        state.loading = false;
        // After applying, status becomes pending
        state.ibRequestStatus = 'pending';
      })
      .addCase(applyIbRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchIbUserRequest
      .addCase(fetchIbUserRequest.pending, (state) => {
        state.ibRequestLoading = true;
        state.ibRequestError = null;
      })
      .addCase(fetchIbUserRequest.fulfilled, (state, action) => {
        state.ibRequestLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        const data = payload?.data || payload;
        // Take the latest request's status
        const latest = Array.isArray(data) ? data[0] : data;
        state.ibRequestStatus = latest?.status || null;
      })
      .addCase(fetchIbUserRequest.rejected, (state, action) => {
        state.ibRequestLoading = false;
        state.ibRequestError = action.payload;
        // No request found — treat as not applied yet
        state.ibRequestStatus = null;
      })
      // fetchIbProfitSharing
      .addCase(fetchIbProfitSharing.pending, (state) => {
        state.profitSharingLoading = true;
        state.profitSharingError = null;
      })
      .addCase(fetchIbProfitSharing.fulfilled, (state, action) => {
        state.profitSharingLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.profitSharingSummary = payload?.summary || null;
        state.profitSharingData = payload?.data || [];
        state.profitSharingCount = payload?.count || 0;
      })
      .addCase(fetchIbProfitSharing.rejected, (state, action) => {
        state.profitSharingLoading = false;
        state.profitSharingError = action.payload;
      });
  },
});

export const { clearIbUserState } = ibUserSlice.actions;
export default ibUserSlice.reducer;
