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
  fetchUserById,
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
  fetchAllDocument,
  fetchDashboardStats,
  setSelectedAccountId,
} from '@/store/slice/accountSlice';
import ibUserReducer, {
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
  fetchIbUserRequest,
  fetchIbClients,
  fetchIbIncome,
} from '@/store/slice/ibUserSlice';
import dashboardReducer, {
  fetchRecentTransactions,
  fetchDashboardCharts,
  fetchDashboardInvestment,
  fetchDashboardCommission,
  clearDashboardState,
} from '@/store/slice/dashboardSlice';
import performanceReducer, {
  fetchPerformanceUsers,
  clearPerformanceState,
} from '@/store/slice/performanceSlice';

const reducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  otp: otpReducer,
  account: accountReducer,
  ibUser: ibUserReducer,
  dashboard: dashboardReducer,
  performance: performanceReducer,
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
  fetchUserById,
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
  fetchAllDocument,
  fetchRecentTransactions,
  fetchDashboardCharts,
  fetchDashboardInvestment,
  fetchDashboardCommission,
  clearDashboardState,
  setSelectedAccountId,
  fetchPerformanceUsers,
  clearPerformanceState,
};
export default reducer;
