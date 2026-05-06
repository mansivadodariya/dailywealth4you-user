import api from '@/service/api';
import { GET_ALL_PERFORMANCE_USER } from '@/service/url';
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

const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    performanceUsers: [],
    performanceLoading: false,
    performanceError: null,

  },
  reducers: {
    clearPerformanceState: (state) => {
      state.performanceUsers = [];
      state.performanceLoading = false;
      state.performanceError = null;
      state.performanceTotalPages = 1;
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
        state.performanceUsers = action?.payload?.payload ;
        
      })
      .addCase(fetchPerformanceUsers.rejected, (state, action) => {
        state.performanceLoading = false;
        state.performanceError = action.payload;
      });
  },
});

export const { clearPerformanceState } = performanceSlice.actions;
export default performanceSlice.reducer;
