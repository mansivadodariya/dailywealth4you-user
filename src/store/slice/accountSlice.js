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
} from '@/service/url';
import { getUserFromCookie } from '@/service/cookies';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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
      const response = await api.put(`${UPDATE_TRADING_ACCOUNT}?id=${id}`, body);
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
      toast.error(error?.response?.data?.message || 'Failed to delete trading account.');
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

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    brokers: [],
    tradingAccounts: [],
    faqs: [],
    loading: false,
    tradingAccountsLoading: false,
    faqsLoading: false,
    error: null,
    tradingAccountsError: null,
    faqsError: null,
  },
  reducers: {
    clearAccountState: (state) => {
      state.brokers = [];
      state.tradingAccounts = [];
      state.loading = false;
      state.tradingAccountsLoading = false;
      state.error = null;
      state.tradingAccountsError = null;
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
          action?.payload?.payload?.data || action?.payload?.data || action?.payload;
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
      });
  },
});

export const { clearAccountState } = accountSlice.actions;
export default accountSlice.reducer;
