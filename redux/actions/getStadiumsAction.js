import {
  GETTINGSTADIUSM,
  GETTINGSTADIUSM_SUCCESS,
  GETTINGSTADIUSM_FAILED
} from "../actions/types";
export default function gettingStadiums(stadiumsList) {
  console.log("GET ME SOME STADIUMS!", stadiumsList.length, stadiumsList);
  return dispatch => {
    dispatch({ type: GETTINGSTADIUSM });
    if (stadiumsList.length > 0) {
      dispatch({
        type: GETTINGSTADIUSM_SUCCESS,
        payload: { stadiumsList }
      });
    } else {
      dispatch({ type: GETTINGSTADIUSM_FAILED });
    }
  };
}
