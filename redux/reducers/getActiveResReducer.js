import {
  GETUSERSACTIVERES,
  GETUSERSACTIVERES_FAILED,
  GETUSERSACTIVERES_SUCCESS
} from "../actions/types";

const initialState = {
  activeReservationNumber: 0
};

export default function(state = initialState, action) {
  console.log("REDUCERIS", action);
  switch (action.type) {
    case GETUSERSACTIVERES:
      return {
        ...state
      };
    case GETUSERSACTIVERES_SUCCESS:
      console.log("fired active number", action.payload.activeResNumb);
      return {
        ...state,
        activeReservationNumber: action.payload.activeResNumb
      };
    case GETUSERSACTIVERES_FAILED:
      return {
        ...state,
        activeReservationNumber: 0
      };

    default:
      return state;
  }
}
