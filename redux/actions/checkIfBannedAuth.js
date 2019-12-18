import {
  CHECKIFBANNED,
  CHECKIFBANNED_FAILED,
  CHECKIFBANNED_SUCCESS
} from "../actions/types";
import firebase from "firebase";
import { getTodaysTime } from "../../components/getTodaysTime";
import { getTodaysDate } from "../../components/getTodaysDate";
export default function checkIfBanned(userId) {
  let todaysTime = getTodaysTime();
  let today = getTodaysDate();
  console.log("FIRE!");
  return dispatch => {
    dispatch({ type: CHECKIFBANNED });
    return firebase
      .firestore()
      .collection("bannedUsers")
      .where("userId", "==", userId)
      .where("banDate", ">=", today)
      .orderBy("banDate")
      .get()
      .then(res => {
        let banDate = "2019-12-15";
        let banTime = "16:00";
        dispatch({
          type: CHECKIFBANNED_SUCCESS,
          payload: { banDate, banTime }
        });
        console.log(res);
      })
      .catch(err => {
        console.log("CHECKIFBANNED_FAILED");
        dispatch({ type: CHECKIFBANNED_FAILED, err });
        return err;
      });
  };
}
