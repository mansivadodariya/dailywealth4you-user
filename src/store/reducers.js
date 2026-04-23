import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  adminLoginUser,
  clearLoginState,
  loginUser,
  resetPassword,
  logout,
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
} from '@/store/slice/accountSlice';
import ibUserReducer, {
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
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
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearOtpState,
  fetchBrokers,
  fetchTradingAccounts,
  fetchTutorials,
  clearAccountState,
  applyIbRequest,
  clearIbUserState,
  fetchIbProfitSharing,
};
export default reducer;
