import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  adminLoginUser,
  clearLoginState,
  loginUser,
  resetPassword,
  logout,
  updateUserProfile,
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
} from '@/store/slice/accountSlice';
import ibUserReducer, {
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
  fetchIbUserRequest,
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
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearOtpState,
  fetchBrokers,
  fetchTradingAccounts,
  fetchTutorials,
  fetchAccountHistory,
  clearAccountState,
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
  fetchIbUserRequest,
};
export default reducer;
