import api from '@/service/api';
import {
  GET_ALL_PERFORMANCE_USER,
  GET_ALL_SOCIAL_POOL,
  POOL_PURCHASE_BY_USER,
  GET_ALL_POOL_PURCHASE,
  UPDATE_POOL_PURCHASE,
  DELETE_POOL_PURCHASE,
} from '@/service/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const fetchPerformanceUsers = createAsyncThunk(
  'performance/fetchPerformanceUsers',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`${GET_ALL_PERFORMANCE_USER}${query}`);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchSocialPools = createAsyncThunk(
  'performance/fetchSocialPools',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`${GET_ALL_SOCIAL_POOL}${query}`);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const joinSocialPool = createAsyncThunk(
  'performance/joinSocialPool',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(POOL_PURCHASE_BY_USER, payload);
      // toast.success('Successfully joined the pool!');
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchPoolPurchases = createAsyncThunk(
  'performance/fetchPoolPurchases',
  async (id, thunkApi) => {
    try {
      // const params = new URLSearchParams();

      const response = await api.get(`${GET_ALL_POOL_PURCHASE}?userId=${id}`);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updatePoolPurchase = createAsyncThunk(
  'performance/updatePoolPurchase',
  async ({ id, depositAmount }, thunkApi) => {
    try {
      const response = await api.put(`${UPDATE_POOL_PURCHASE}?id=${id}`, {
        depositAmount,
      });
      toast.success('Balance added successfully!');
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deletePoolPurchase = createAsyncThunk(
  'performance/deletePoolPurchase',
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`${DELETE_POOL_PURCHASE}?id=${id}`);
      toast.success('Pool deleted successfully!');
      return { id, response };
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    performanceUsers: [],
    performanceLoading: false,
    performanceError: null,
    performanceTotalPages: 1,
    socialPools: [],
    socialPoolsLoading: false,
    socialPoolsError: null,
    socialPoolsCount: 0,
    joinPoolLoading: false,
    joinPoolError: null,
    poolPurchases: [],
    poolPurchasesLoading: false,
    poolPurchasesError: null,
    poolPurchasesCount: 0,
    updatePoolLoading: false,
    updatePoolError: null,
    deletePoolLoading: false,
    deletePoolError: null,
  },
  reducers: {
    clearPerformanceState: (state) => {
      state.performanceUsers = [];
      state.performanceLoading = false;
      state.performanceError = null;
      state.performanceTotalPages = 1;
      state.socialPools = [];
      state.socialPoolsLoading = false;
      state.socialPoolsError = null;
      state.socialPoolsCount = 0;
      state.joinPoolLoading = false;
      state.joinPoolError = null;
      state.poolPurchases = [];
      state.poolPurchasesLoading = false;
      state.poolPurchasesError = null;
      state.poolPurchasesCount = 0;
      state.updatePoolLoading = false;
      state.updatePoolError = null;
      state.deletePoolLoading = false;
      state.deletePoolError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceUsers.pending, (state) => {
        state.performanceLoading = true;
        state.performanceError = null;
      })
      .addCase(fetchPerformanceUsers.fulfilled, (state, action) => {
        state.performanceLoading = false;
        state.performanceUsers = action?.payload?.payload;
      })
      .addCase(fetchPerformanceUsers.rejected, (state, action) => {
        state.performanceLoading = false;
        state.performanceError = action.payload;
      })
      .addCase(fetchSocialPools.pending, (state) => {
        state.socialPoolsLoading = true;
        state.socialPoolsError = null;
      })
      .addCase(fetchSocialPools.fulfilled, (state, action) => {
        state.socialPoolsLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.socialPools = payload?.data || [];
        state.socialPoolsCount = payload?.count || 0;
      })
      .addCase(fetchSocialPools.rejected, (state, action) => {
        state.socialPoolsLoading = false;
        state.socialPoolsError = action.payload;
      })
      .addCase(joinSocialPool.pending, (state) => {
        state.joinPoolLoading = true;
        state.joinPoolError = null;
      })
      .addCase(joinSocialPool.fulfilled, (state) => {
        state.joinPoolLoading = false;
      })
      .addCase(joinSocialPool.rejected, (state, action) => {
        state.joinPoolLoading = false;
        state.joinPoolError = action.payload;
      })
      .addCase(fetchPoolPurchases.pending, (state) => {
        state.poolPurchasesLoading = true;
        state.poolPurchasesError = null;
      })
      .addCase(fetchPoolPurchases.fulfilled, (state, action) => {
        state.poolPurchasesLoading = false;
        const payload = action?.payload?.payload || action?.payload;
        state.poolPurchases = payload?.data || [];
        state.poolPurchasesCount = payload?.count || 0;
      })
      .addCase(fetchPoolPurchases.rejected, (state, action) => {
        state.poolPurchasesLoading = false;
        state.poolPurchasesError = action.payload;
      })
      .addCase(updatePoolPurchase.pending, (state) => {
        state.updatePoolLoading = true;
        state.updatePoolError = null;
      })
      .addCase(updatePoolPurchase.fulfilled, (state, action) => {
        state.updatePoolLoading = false;
        const updatedPurchase =
          action?.payload?.payload?.data ||
          action?.payload?.data ||
          action?.payload;
        if (updatedPurchase) {
          state.poolPurchases = state.poolPurchases.map((purchase) =>
            purchase?.id === updatedPurchase?.id ? updatedPurchase : purchase
          );
        }
      })
      .addCase(updatePoolPurchase.rejected, (state, action) => {
        state.updatePoolLoading = false;
        state.updatePoolError = action.payload;
      })
      .addCase(deletePoolPurchase.pending, (state) => {
        state.deletePoolLoading = true;
        state.deletePoolError = null;
      })
      .addCase(deletePoolPurchase.fulfilled, (state, action) => {
        state.deletePoolLoading = false;
        const deletedId = action.payload.id;
        state.poolPurchases = state.poolPurchases.filter(
          (purchase) => purchase.id !== deletedId
        );
        state.poolPurchasesCount = Math.max(0, state.poolPurchasesCount - 1);
      })
      .addCase(deletePoolPurchase.rejected, (state, action) => {
        state.deletePoolLoading = false;
        state.deletePoolError = action.payload;
      });
  },
});

export const { clearPerformanceState } = performanceSlice.actions;
export default performanceSlice.reducer;
