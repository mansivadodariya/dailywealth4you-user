import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import { GET_ALL_TRANSACTION, GET_DASHBOARD_CHARTS } from '@/service/url';
import moment from 'moment';

// ─── Helper: compute date range from period label ─────────────────────────────
export function getDateRangeForPeriod(period) {
  const endDate = moment().format('YYYY-MM-DD');
  let startDate;
  switch (period) {
    case 'Last 30 Days':
      startDate = moment().subtract(29, 'days').format('YYYY-MM-DD');
      break;
    case 'Last 90 Days':
      startDate = moment().subtract(89, 'days').format('YYYY-MM-DD');
      break;
    case 'Last 7 Days':
    default:
      startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
      break;
  }
  return { startDate, endDate };
}

// ─── Thunk: fetch portfolio growth + lots traded charts ───────────────────────
// GET /tradesHistory/getUserDashboardProfitLots?userId=&startDate=&endDate=
export const fetchDashboardCharts = createAsyncThunk(
  'dashboard/fetchDashboardCharts',
  async ({ userId, startDate, endDate, accountId } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (accountId) params.append('accountId', accountId);

      const response = await api.get(
        `${GET_DASHBOARD_CHARTS}?${params.toString()}`
      );

      // Response shape: { payload: { portfolioGrowth: [...], lotsTraded: [...] } }
      const payload = response?.payload || response?.data || response;
      return {
        portfolioGrowth: payload?.portfolioGrowth || [],
        lotsTraded: payload?.lotsTraded || [],
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Thunk: fetch recent transactions ────────────────────────────────────────
// GET /transaction/getAllTransaction?userId=&limit=
export const fetchRecentTransactions = createAsyncThunk(
  'dashboard/fetchRecentTransactions',
  async ({ userId,accountId, limit = 6 } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (limit) params.append('limit', limit);
      if (accountId) params.append('accountId', accountId);

      const response = await api.get(
        `${GET_ALL_TRANSACTION}?${params.toString()}`
      );

      const data =
        response?.payload?.data ||
        response?.payload ||
        response?.data ||
        response ||
        [];

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    // Chart data
    portfolioGrowth: [],
    lotsTraded: [],
    chartsLoading: false,
    chartsError: null,
    // Recent transactions
    recentTransactions: [],
    recentTransactionsLoading: false,
    recentTransactionsError: null,
  },
  reducers: {
    clearDashboardState: (state) => {
      state.portfolioGrowth = [];
      state.lotsTraded = [];
      state.chartsLoading = false;
      state.chartsError = null;
      state.recentTransactions = [];
      state.recentTransactionsLoading = false;
      state.recentTransactionsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchDashboardCharts ──────────────────────────────────────────────
      .addCase(fetchDashboardCharts.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchDashboardCharts.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.portfolioGrowth = action.payload.portfolioGrowth;
        state.lotsTraded = action.payload.lotsTraded;
      })
      .addCase(fetchDashboardCharts.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.payload;
      })
      // ── fetchRecentTransactions ───────────────────────────────────────────
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.recentTransactionsLoading = true;
        state.recentTransactionsError = null;
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.recentTransactionsLoading = false;
        state.recentTransactions = action.payload;
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.recentTransactionsLoading = false;
        state.recentTransactionsError = action.payload;
        state.recentTransactions = [];
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
