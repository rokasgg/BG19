import {
  REGISTRATION,
  REGISTRATION_FAILED,
  REGISTRATION_SUCCESS
} from "../actions/types";

const initialState = {
  username: null,
  userId: null,
  email: null,
  position: null,
  password: null,
  admin: false,

  isLoading: false,
  isLoggedIn: null,
  error: null
};

export default function(state = initialState, action) {
  console.log("REDUCERIS", action);
  switch (action.type) {
    case REGISTRATION:
      return {
        ...state,
        isLoading: true
      };
    case REGISTRATION_SUCCESS:
      console.log("fired1");
      return {
        ...state,
        username: action.payload.userName,
        userId: action.payload.userId,
        email: action.payload.email,
        position: action.payload.position,
        admin: false,
        isLoading: false,
        isLoggedIn: true
      };
    case REGISTRATION_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}
