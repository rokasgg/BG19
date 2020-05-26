import {
  GETUSERSACTIVERES,
  GETUSERSACTIVERES_SUCCESS,
  GETUSERSACTIVERES_FAILED
} from "../actions/types";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import { getTodaysTime } from "../../components/getTodaysTime";
import { getTodaysDate } from "../../components/getTodaysDate";
import { formateTime } from "../../components/timeConverte";

const checkIfResActive = item => {
  let today = getTodaysDate();
  let timeNow = getTodaysTime();
  let reservationDate = item.date;
  let reservationeTime = formateTime(item.time);
  console.log("asdsa", timeNow, reservationeTime);
  if (reservationDate > today) return true;
  else if (reservationDate === today) {
    if (timeNow < reservationeTime.finishTime) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default function gettingActiveRes(userId) {
  console.log("FIREN!");
  let today = getTodaysDate();
  let listOfActiveRes = [];
  return dispatch => {
    dispatch({ type: GETUSERSACTIVERES });
    let qwery = firebase
      .firestore()
      .collection("reservations")
      .where("userId", "==", userId)
      .where("date", ">=", today)
      .orderBy("date", "asc");
    qwery
      .get()
      .then(res => {
        if (res.docs.length > 0) {
          var counteris = 0;
          res.forEach(data => {
            if (
              checkIfResActive({
                date: data._document.proto.fields.date.stringValue,
                time: data._document.proto.fields.time.stringValue
              })
            ) {
              listOfActiveRes.push(data);
            }
          });
          let activeResNumb = listOfActiveRes.length;
          dispatch({
            type: GETUSERSACTIVERES_SUCCESS,
            payload: { activeResNumb }
          });
        } else {
          dispatch({ type: GETUSERSACTIVERES_FAILED }),
            console.log("AKTYVIU REZERVACIJU NERA");
        }
      })
      .catch(err => {
        console.log("NEGAVOME AKTYVIU REZERVACIJU", err);
        dispatch({ type: GETUSERSACTIVERES_FAILED });
      });
  };
}
