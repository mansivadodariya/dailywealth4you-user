import { combineReducers } from '@reduxjs/toolkit';
import loginReducer, {
  clearLoginState,
  loginUser,
  logout,
} from '@/store/slice/loginSlice';
import signupReducer, {
  clearSignupState,
  signupUser,
} from '@/store/slice/signupSlice';

const reducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
});

export { signupUser, loginUser, clearSignupState, clearLoginState, logout };
export default reducer;
