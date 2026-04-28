import api from '@/service/api';
import {
  CREATE_TRADING_ACCOUNT,
  UPDATE_TRADING_ACCOUNT,
  DELETE_TRADING_ACCOUNT,
  GET_ALL_BROKERS,
  GET_ALL_TRADING_ACCOUNTS,
  GET_ALL_FAQ,
  CREATE_CONTACT_US,
  UPLOAD_USER_DOCUMENT,
  UPLOAD_IMAGE,
  GET_ALL_TUTORIALS,
  GET_ACCOUNT_HISTORY,
  CREATE_TRANSACTION,
  GET_ALL_TRANSACTION,
  GET_ALL_DOCUMENT,
  GET_DASHBOARD_STATS,
} from '@/service/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export const fetchBrokers = createAsyncThunk(
  'account/fetchBrokers',
  async (payload, thunkApi) => {
    const { page, limit } = payload;

    try {
      const response = await api.get(
        `${GET_ALL_BROKERS}?page=${page}&limit=${limit}`
      );
      //   debugger
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchTradingAccounts = createAsyncThunk(
  'account/fetchTradingAccounts',
  async (payload, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ALL_TRADING_ACCOUNTS}?userId=${payload}`
      );
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createTradingAccount = createAsyncThunk(
  'account/createTradingAccount',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(CREATE_TRADING_ACCOUNT, payload);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateTradingAccount = createAsyncThunk(
  'account/updateTradingAccount',
  async (payload, thunkApi) => {
    try {
      const { id, ...body } = payload;
      const response = await api.put(
        `${UPDATE_TRADING_ACCOUNT}?id=${id}`,
        body
      );
      toast.success('Trading account updated successfully.');
      return response;
    } catch (error) {
      // toast.error(error?.response?.data?.message || 'Failed to update trading account.');
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteTradingAccount = createAsyncThunk(
  'account/deleteTradingAccount',
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`${DELETE_TRADING_ACCOUNT}?id=${id}`);
      toast.success('Trading account deleted successfully.');
      return { id, response };
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete trading account.'
      );
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchFaqs = createAsyncThunk(
  'account/fetchFaqs',
  async (_, thunkApi) => {
    try {
      const response = await api.get(GET_ALL_FAQ);
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createContactUs = createAsyncThunk(
  'account/createContactUs',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(CREATE_CONTACT_US, payload);
      toast.success('Your message has been sent successfully.');
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send message.');
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const uploadUserDocument = createAsyncThunk(
  'account/uploadUserDocument',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(UPLOAD_USER_DOCUMENT, payload);
      //   toast.success('Document uploaded successfully.');
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const uploadImage = createAsyncThunk(
  'account/uploadImage',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(UPLOAD_IMAGE, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchTutorials = createAsyncThunk(
  'account/fetchTutorials',
  async ({ page = 1, limit = 12 } = {}, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ALL_TUTORIALS}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAccountHistory = createAsyncThunk(
  'account/fetchAccountHistory',
  async ({ userId, brokerId }, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ACCOUNT_HISTORY}?userId=${userId}&brokerId=${brokerId}`
      );
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'account/createTransaction',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(CREATE_TRANSACTION, payload);
      toast.success(
        payload.type === 'deposit'
          ? 'Deposit submitted successfully.'
          : 'Withdrawal request submitted successfully.'
      );
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

// payload: { type, userId, search?, page?, limit?, startDate?, endDate?, minAmount?, maxAmount?, status?, mt5Account? }
export const fetchTransactions = createAsyncThunk(
  'account/fetchTransactions',
  async (payload, thunkApi) => {
    try {
      const {
        type,
        userId,
        search,
        page = 1,
        limit = 10,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        status,
        mt5Account,
      } = payload;

      const params = new URLSearchParams();
      params.append('type', type);
      if (userId) params.append('userId', userId);
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (minAmount !== undefined && minAmount !== '')
        params.append('minAmount', minAmount);
      if (maxAmount !== undefined && maxAmount !== '')
        params.append('maxAmount', maxAmount);
      if (status) params.append('status', status);
      if (mt5Account) params.append('mt5Account', mt5Account);

      const response = await api.get(
        `${GET_ALL_TRANSACTION}?${params.toString()}`
      );
      return { response, type };
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllDocument = createAsyncThunk(
  'account/fetchAllDocument',
  async (userId, thunkApi) => {
    try {
      const response = await api.get(
        `${GET_ALL_DOCUMENT}${userId ? `?userId=${userId}` : ''}`
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    brokers: [],
    tradingAccounts: [],
    faqs: [],
    tutorials: [],
    tutorialsLoading: false,
    tutorialsError: null,
    tutorialsTotalPages: 1,
    accountHistory: [],
    accountHistoryLoading: false,
    accountHistoryError: null,
    transactionLoading: false,
    transactionError: null,
    deposits: [],
    withdrawals: [],
    transactionsLoading: false,
    transactionsError: null,
    depositsTotalPages: 1,
    withdrawalsTotalPages: 1,
    loading: false,
    tradingAccountsLoading: false,
    faqsLoading: false,
    error: null,
    tradingAccountsError: null,
    faqsError: null,
    // KYC document status
    kycStatus: undefined,
    kycStatusLoading: false,
    // Dashboard stats
    dashboardStats: null,
    dashboardStatsLoading: false,
    dashboardStatsError: null,
  },
  reducers: {
    clearAccountState: (state) => {
      state.brokers = [];
      state.tradingAccounts = [];
      state.loading = false;
      state.tradingAccountsLoading = false;
      state.error = null;
      state.tradingAccountsError = null;
      state.kycStatus = undefined;
      state.kycStatusLoading = false;
      state.kycRejectionReason = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrokers.fulfilled, (state, action) => {
        state.loading = false;
        state.brokers = action?.payload?.payload?.data;
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTradingAccounts.pending, (state) => {
        state.tradingAccountsLoading = true;
        state.tradingAccountsError = null;
      })
      .addCase(fetchTradingAccounts.fulfilled, (state, action) => {
        state.tradingAccountsLoading = false;
        state.tradingAccounts = action?.payload?.payload?.data || [];
      })
      .addCase(fetchTradingAccounts.rejected, (state, action) => {
        state.tradingAccountsLoading = false;
        state.tradingAccountsError = action.payload;
      })

      .addCase(createTradingAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTradingAccount.fulfilled, (state, action) => {
        state.loading = false;

        // optional: push new account into list
        state.tradingAccounts.unshift(action?.payload?.payload?.data);
      })
      .addCase(createTradingAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTradingAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTradingAccount.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAccount =
          action?.payload?.payload?.data ||
          action?.payload?.data ||
          action?.payload;
        if (updatedAccount) {
          state.tradingAccounts = state.tradingAccounts.map((account) =>
            account?.id === updatedAccount?.id ? updatedAccount : account
          );
        }
      })
      .addCase(updateTradingAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTradingAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTradingAccount.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.tradingAccounts = state.tradingAccounts.filter(
          (account) => account.id !== deletedId
        );
      })
      .addCase(deleteTradingAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFaqs.pending, (state) => {
        state.faqsLoading = true;
        state.faqsError = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.faqsLoading = false;
        state.faqs =
          action?.payload?.payload?.data ||
          action?.payload?.data ||
          action?.payload ||
          [];
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.faqsLoading = false;
        state.faqsError = action.payload;
      })
      .addCase(createContactUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContactUs.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadUserDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadUserDocument.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadUserDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTutorials.pending, (state) => {
        state.tutorialsLoading = true;
        state.tutorialsError = null;
      })
      .addCase(fetchTutorials.fulfilled, (state, action) => {
        // debugger
        state.tutorialsLoading = false;
        const payload = action?.payload?.payload?.data;
        state.tutorials = payload;
        state.tutorialsTotalPages =
          payload?.totalPages || payload?.pagination?.totalPages || 1;
      })
      .addCase(fetchTutorials.rejected, (state, action) => {
        state.tutorialsLoading = false;
        state.tutorialsError = action.payload;
      })
      .addCase(fetchAccountHistory.pending, (state) => {
        state.accountHistoryLoading = true;
        state.accountHistoryError = null;
        state.accountHistory = [];
      })
      .addCase(fetchAccountHistory.fulfilled, (state, action) => {
        state.accountHistoryLoading = false;
        const payload = action?.payload?.payload;
        state.accountHistory = payload?.data;
      })
      .addCase(fetchAccountHistory.rejected, (state, action) => {
        state.accountHistoryLoading = false;
        state.accountHistoryError = action.payload;
      })
      .addCase(createTransaction.pending, (state) => {
        state.transactionLoading = true;
        state.transactionError = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.transactionLoading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.transactionLoading = false;
        state.transactionError = action.payload;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        const { response, type } = action.payload;
        const data =
          response?.payload?.data ||
          response?.payload ||
          response?.data ||
          response ||
          [];
        const totalPages =
          response?.payload?.totalPages ||
          response?.payload?.pagination?.totalPages ||
          response?.totalPages ||
          1;
        if (type === 'deposit') {
          state.deposits = Array.isArray(data) ? data : [];
          state.depositsTotalPages = totalPages;
        } else {
          state.withdrawals = Array.isArray(data) ? data : [];
          state.withdrawalsTotalPages = totalPages;
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload;
      })
      .addCase(fetchAllDocument.pending, (state) => {
        state.kycStatusLoading = true;
      })
      .addCase(fetchAllDocument.fulfilled, (state, action) => {
        // debugger
        state.kycStatusLoading = false;

        const data = action?.payload?.payload?.data;
        const doc = Array.isArray(data) ? data[0] : data;
        state.kycStatus = doc?.status ?? null;
        // state.kycRejectionReason = doc?.rejectionReason ?? null;
      })
      .addCase(fetchAllDocument.rejected, (state) => {
        state.kycStatusLoading = false;
        state.kycStatus = null;
      });
  },
});

export const { clearAccountState } = accountSlice.actions;
export default accountSlice.reducer;
