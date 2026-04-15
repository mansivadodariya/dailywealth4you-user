import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  clearLoginState,
  loginUser,
  resetPassword,
  logout,
} from '@/store/slice/loginSlice';
import signupReducer, {
  clearSignupState,
  signupUser,
} from '@/store/slice/signupSlice';
import otpReducer, {
  clearOtpState,
  forgotPassword,
  sendOtp,
  verifyOtp,
} from '@/store/slice/otpSlice';

const reducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  otp: otpReducer,
});

export {
  signupUser,
  loginUser,
  resetPassword,
  clearSignupState,
  clearLoginState,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  clearOtpState,
};
export default reducer;
