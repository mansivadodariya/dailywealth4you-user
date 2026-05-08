import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  GET_ALL_TRANSACTION,
  GET_DASHBOARD_CHARTS,
  GET_DASHBOARD_INVESTMENT,
  GET_DASHBOARD_COMMISSION,
} from '@/service/url';
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

// ─── Thunk: portfolio growth + lots traded charts ─────────────────────────────
// GET /tradesHistory/getUserDashboardProfitLots?userId=&accountId=&startDate=&endDate=
export const fetchDashboardCharts = createAsyncThunk(
  'dashboard/fetchDashboardCharts',
  async ({ userId, accountId, startDate, endDate } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (accountId) params.append('accountId', accountId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `${GET_DASHBOARD_CHARTS}?${params.toString()}`
      );
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

// ─── Thunk: investment amount, current value, gross P&L ──────────────────────
// GET /tradesHistory/getUserDashboardInvestmentAmount?accountId=&startDate=&endDate=
export const fetchDashboardInvestment = createAsyncThunk(
  'dashboard/fetchDashboardInvestment',
  async ({ accountId, startDate, endDate } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `${GET_DASHBOARD_INVESTMENT}?${params.toString()}`
      );
      // Response: { payload: { investmentAmount, currentValue, grossPL } }
      // const payload = response?.payload || response?.data || response;
      // return {
      //   investmentAmount: payload?.investmentAmount ?? null,
      //   currentValue: payload?.currentValue ?? null,
      //   grossPL: payload?.grossPL ?? null,
      // };
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Thunk: commission profit (IB income + profit sharing) ───────────────────
// GET /tradesHistory/getUserDashboardCommissionProfit
export const fetchDashboardCommission = createAsyncThunk(
  'dashboard/fetchDashboardCommission',
  async (mt5LoginId, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (mt5LoginId) params.append('accountId', mt5LoginId);

      const response = await api.get(
        `${GET_DASHBOARD_COMMISSION}?${params.toString()}`
      );
      // Response: { payload: { totalProfitSharing, totalIbIncome, totalCommission } }
      const payload = response?.payload || response?.data || response;
      return {
        totalProfitSharing: payload?.totalProfitSharing ?? null,
        totalIbIncome: payload?.totalIbIncome ?? null,
        totalCommission: payload?.totalCommission ?? null,
      };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Thunk: recent transactions ──────────────────────────────────────────────
// GET /transaction/getAllTransaction?userId=&limit=
export const fetchRecentTransactions = createAsyncThunk(
  'dashboard/fetchRecentTransactions',
  async ({ userId, accountId, limit = 6 } = {}, thunkApi) => {
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
    // Investment stats
    investmentAmount: null,
    currentValue: null,
    grossPL: null,
    investmentLoading: false,
    investmentError: null,
    myProfit:null,
    // Commission / IB stats
    totalProfitSharing: null,
    totalIbIncome: null,
    totalCommission: null,
    commissionLoading: false,
    commissionError: null,
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
      state.investmentAmount = null;
      state.currentValue = null;
      state.grossPL = null;
      state.investmentLoading = false;
      state.investmentError = null;
      state.myProfit=null
      state.totalProfitSharing = null;
      state.totalIbIncome = null;
      state.totalCommission = null;
      state.commissionLoading = false;
      state.commissionError = null;
      state.recentTransactions = [];
      state.recentTransactionsLoading = false;
      state.recentTransactionsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDashboardCharts
      .addCase(fetchDashboardCharts.pending, (state) => {
        state.chartsLoading = true;
        state.chartsError = null;
      })
      .addCase(fetchDashboardCharts.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.portfolioGrowth = action?.payload?.portfolioGrowth;
        state.lotsTraded = action?.payload?.lotsTraded;
      })
      .addCase(fetchDashboardCharts.rejected, (state, action) => {
        state.chartsLoading = false;
        state.chartsError = action.payload;
      })
      // fetchDashboardInvestment
      .addCase(fetchDashboardInvestment.pending, (state) => {
        state.investmentLoading = true;
        state.investmentError = null;
      })
      .addCase(fetchDashboardInvestment.fulfilled, (state, action) => {
    
        state.investmentLoading = false;
        state.investmentAmount = action?.payload?.payload?.investmentAmount;
        state.currentValue = action?.payload?.payload?.currentValue;
        state.grossPL = action?.payload?.payload?.grossPL;
        state.myProfit= action?.payload?.payload?.myProfit
       
      })
      .addCase(fetchDashboardInvestment.rejected, (state, action) => {
        state.investmentLoading = false;
        state.investmentError = action?.payload;
      })
      // fetchDashboardCommission
      .addCase(fetchDashboardCommission.pending, (state) => {
        state.commissionLoading = true;
        state.commissionError = null;
      })
      .addCase(fetchDashboardCommission.fulfilled, (state, action) => {
        state.commissionLoading = false;
        state.totalProfitSharing = action?.payload?.totalProfitSharing;
        state.totalIbIncome = action?.payload?.totalIbIncome;
        state.totalCommission = action?.payload?.totalCommission;
         
      })
      .addCase(fetchDashboardCommission.rejected, (state, action) => {
        state.commissionLoading = false;
        state.commissionError = action?.payload;
      })
      // fetchRecentTransactions
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.recentTransactionsLoading = true;
        state.recentTransactionsError = null;
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.recentTransactionsLoading = false;
        state.recentTransactions = action?.payload;
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
