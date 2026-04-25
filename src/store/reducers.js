import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  adminLoginUser,
  clearLoginState,
  loginUser,
  resetPassword,
  logout,
  updateUserProfile,
  fetchNotifications,
  addNotification,
  markAllRead,
  updateNotification,
} from '@/store/slice/loginSlice';
import signupReducer, { signupUser } from '@/store/slice/signupSlice';
import otpReducer, {
  clearOtpState,
  forgotPassword,
  sendOtp,
  verifyOtp,
} from '@/store/slice/otpSlice';
import accountReducer, {
  clearAccountState,
  fetchBrokers,
  fetchTradingAccounts,
  fetchTutorials,
  fetchAccountHistory,
  createTransaction,
  fetchTransactions,
} from '@/store/slice/accountSlice';
import ibUserReducer, {
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
  fetchIbUserRequest,
  fetchIbClients,
  fetchIbIncome,
} from '@/store/slice/ibUserSlice';

const reducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  otp: otpReducer,
  account: accountReducer,
  ibUser: ibUserReducer,
});

export {
  signupUser,
  loginUser,
  adminLoginUser,
  resetPassword,
  clearLoginState,
  logout,
  updateUserProfile,
  fetchNotifications,
  addNotification,
  markAllRead,
  updateNotification,
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearOtpState,
  fetchBrokers,
  fetchTradingAccounts,
  fetchTutorials,
  fetchAccountHistory,
  createTransaction,
  fetchTransactions,
  clearAccountState,
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
  fetchIbUserRequest,
  fetchIbClients,
  fetchIbIncome,
};
export default reducer;
