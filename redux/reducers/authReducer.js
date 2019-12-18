import {
  AUTHENTICATE,
  AUTHENTICATE_FAIL,
  AUTHENTICATE_SUCCESS,
  LOGOUT,
  LOGOUT_FAILED,
  LOGOUT_SUCCESS
} from "../actions/types";

const initialState = {
  user: null,
  userUid: null,
  userName: null,
  isLoading: false,
  isLoggedIn: false,
  admin: false,
  banTime: null,
  banDate: null,
  error: null
};

export default function(state = initialState, action) {
  console.log("REDUCERIS", action);
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isLoading: true
      };
    case AUTHENTICATE_SUCCESS:
      console.log("fired1");
      return {
        ...state,
        user: action.payload.user,
        userUid: action.payload.uid,
        userName: action.payload.name,
        admin: action.payload.admin,
        isLoading: false,
        isLoggedIn: true
      };
    case AUTHENTICATE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case LOGOUT:
      return {
        ...state,
        isLoading: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        userUid: action.payload.uid,
        admin: false,
        userName: null,
        isLoading: false,
        isLoggedIn: false
      };
    case LOGOUT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}
