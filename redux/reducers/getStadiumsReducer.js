import {
  GETTINGSTADIUSM,
  GETTINGSTADIUSM_FAILED,
  GETTINGSTADIUSM_SUCCESS
} from "../actions/types";

const initialState = {
  stadiumsList: []
};

export default function(state = initialState, action) {
  console.log("REDUCERIS", action);
  switch (action.type) {
    case GETTINGSTADIUSM:
      return {
        ...state
      };
    case GETTINGSTADIUSM_SUCCESS:
      console.log("fired active number", action.payload.stadiumsList);
      return {
        ...state,
        stadiumsList: action.payload.stadiumsList
      };
    case GETTINGSTADIUSM_FAILED:
      return {
        ...state,
        stadiumsList: []
      };

    default:
      return state;
  }
}
