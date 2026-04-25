import api from '@/service/api';
import {
  APPLY_IB_REQUEST,
  GET_IB_PROFIT_SHARING,
  GET_ALL_IB_USER_REQUEST,
  GET_IB_CLIENT,
  GET_IB_INCOME,
} from '@/service/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

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

export const fetchIbClients = createAsyncThunk(
  'ibUser/fetchIbClients',
  async (_, thunkApi) => {
    try {
      const response = await api.get(GET_IB_CLIENT);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIbIncome = createAsyncThunk(
  'ibUser/fetchIbIncome',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`${GET_IB_INCOME}${query}`);
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
    ibRequestStatus: null,
    ibRequestLoading: false,
    ibRequestError: null,
    // IB Profit Sharing
    profitSharingSummary: null,
    profitSharingData: [],
    profitSharingCount: 0,
    profitSharingLoading: false,
    profitSharingError: null,
    // IB Clients
    ibClients: [],
    ibClientsLoading: false,
    ibClientsError: null,
    // IB Income
    ibIncomeSummary: null,
    ibIncomeData: [],
    ibIncomeCount: 0,
    ibIncomeLoading: false,
    ibIncomeError: null,
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
      state.ibClients = [];
      state.ibClientsLoading = false;
      state.ibClientsError = null;
      state.ibIncomeSummary = null;
      state.ibIncomeData = [];
      state.ibIncomeCount = 0;
      state.ibIncomeLoading = false;
      state.ibIncomeError = null;
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
        const latest = Array.isArray(data) ? data[0] : data;
        state.ibRequestStatus = latest?.status || null;
      })
      .addCase(fetchIbUserRequest.rejected, (state, action) => {
        state.ibRequestLoading = false;
        state.ibRequestError = action.payload;
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
      })
      // fetchIbClients
      .addCase(fetchIbClients.pending, (state) => {
        state.ibClientsLoading = true;
        state.ibClientsError = null;
      })
      .addCase(fetchIbClients.fulfilled, (state, action) => {
        state.ibClientsLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.ibClients = payload?.data || payload || [];
      })
      .addCase(fetchIbClients.rejected, (state, action) => {
        state.ibClientsLoading = false;
        state.ibClientsError = action.payload;
      })
      // fetchIbIncome
      .addCase(fetchIbIncome.pending, (state) => {
        state.ibIncomeLoading = true;
        state.ibIncomeError = null;
      })
      .addCase(fetchIbIncome.fulfilled, (state, action) => {
        state.ibIncomeLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.ibIncomeSummary = payload?.summary || null;
        state.ibIncomeData = payload?.data || [];
        state.ibIncomeCount = payload?.count || 0;
      })
      .addCase(fetchIbIncome.rejected, (state, action) => {
        state.ibIncomeLoading = false;
        state.ibIncomeError = action.payload;
      });
  },
});

export const { clearIbUserState } = ibUserSlice.actions;
export default ibUserSlice.reducer;
