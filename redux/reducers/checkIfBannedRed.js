import {
  CHECKIFBANNED,
  CHECKIFBANNED_FAILED,
  CHECKIFBANNED_SUCCESS
} from "../actions/types";

const initialState = {
  banDate: null,
  banTime: null,
  banned: true,
  error: null
};

export default function(state = initialState, action) {
  console.log("REDUCERIS", action);
  switch (action.type) {
    case CHECKIFBANNED:
      return {
        ...state,
        isLoading: true
      };
    case CHECKIFBANNED_SUCCESS:
      console.log("fired1");
      return {
        ...state,
        banTime: action.payload.uid,
        banDate: action.payload.name,
        banned: true
      };
    case CHECKIFBANNED_FAILED:
      return {
        ...state,
        banned: false,
        error: action.error
      };

    default:
      return state;
  }
}
