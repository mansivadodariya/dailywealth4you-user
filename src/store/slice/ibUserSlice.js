import api from '@/service/api';
import { APPLY_IB_REQUEST, GET_IB_PROFIT_SHARING } from '@/service/url';
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

export const fetchIbProfitSharing = createAsyncThunk(
  'ibUser/fetchIbProfitSharing',
  async (_, thunkApi) => {
    try {
      const response = await api.get(GET_IB_PROFIT_SHARING);
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
    // IB Profit Sharing
    profitSharingSummary: null, // { totalClients, totalLots, totalCommission }
    profitSharingData: [], // array of { user, brokers[] }
    profitSharingCount: 0,
    profitSharingLoading: false,
    profitSharingError: null,
  },
  reducers: {
    clearIbUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.profitSharingSummary = null;
      state.profitSharingData = [];
      state.profitSharingCount = 0;
      state.profitSharingLoading = false;
      state.profitSharingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyIbRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyIbRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyIbRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
