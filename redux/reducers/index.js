import { combineReducers } from "redux";
import authReducer from "../reducers/authReducer";
import dummyReducer from "../reducers/dummyReducer";
import regReducer from "../reducers/regReducer";
import checkIfBanned from "../reducers/checkIfBannedRed";
import getActiveRes from "../reducers/getActiveResReducer";
export default combineReducers({
  auth: authReducer,
  dummyReducer: dummyReducer,
  reg: regReducer,
  check: checkIfBanned,
  active: getActiveRes
});
