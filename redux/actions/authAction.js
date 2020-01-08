import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCESS
} from "../actions/types";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import { getTodaysTime } from "../../components/getTodaysTime";
import { getTodaysDate } from "../../components/getTodaysDate";
const saveUserInfo = async (username, password) => {
  try {
    AsyncStorage.multiSet([
      ["isRemembered", "true"],
      ["username", username],
      ["password", password]
    ]);
  } catch (err) {
    console.log("Saving user error", err);
  }
};

export default function login(userName, password, isRemembered) {
  console.log("FIRE!");
  let today = getTodaysDate();
  let nowTime = getTodaysTime();

  return dispatch => {
    dispatch({ type: AUTHENTICATE });
    return firebase
      .auth()
      .signInWithEmailAndPassword(userName, password)
      .then(response => {
        console.log(response, "LOGINO RES");
        const user = response.user.email;
        const uid = response.user.uid;
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then(snap => {
            console.log("id", snap);
            const name = snap._document.proto.fields.name.stringValue;
            const admin = snap._document.proto.fields.admin.booleanValue;
            const administrator =
              snap._document.proto.fields.administrator.booleanValue;
            if (administrator !== undefined && administrator === true) {
              const administrator =
                snap._document.proto.fields.administrator.booleanValue;
              const stadiumId =
                snap._document.proto.fields.stadiumId.stringValue;
              const stadiumName =
                snap._document.proto.fields.stadiumName.stringValue;
              if (isRemembered) {
                saveUserInfo(userName, password, isRemembered).then(() => {
                  dispatch({
                    type: AUTHENTICATE_SUCCESS,
                    payload: {
                      user,
                      uid,
                      name,
                     
                      admin,
                      administrator,
                      stadiumId,
                      stadiumName
                    }
                  });
                });
              } else {
                dispatch({
                  type: AUTHENTICATE_SUCCESS,
                  payload: {
                    user,
                    uid,
                    name,
                  
                    admin,
                    administrator,
                    stadiumId,
                    stadiumName
                  }
                });
              }
            } else {
              let administrator = false;
              let stadiumId = null;
              let stadiumName = null;
              if (isRemembered) {
                saveUserInfo(userName, password, isRemembered).then(() => {
                  dispatch({
                    type: AUTHENTICATE_SUCCESS,
                    payload: {
                      user,
                      uid,
                      name,
                   
                      admin,
                      administrator,
                      stadiumId,
                      stadiumName
                    }
                  });
                });
              } else {
                dispatch({
                  type: AUTHENTICATE_SUCCESS,
                  payload: {
                    user,
                    uid,
                    name,
               
                    admin,
                    administrator,
                    stadiumId,
                    stadiumName
                  }
                });
              }
            }
          });
        return true;
      })
      .catch(err => {
        console.log("AUTHENTICATE_FAILED");
        dispatch({ type: AUTHENTICATE_FAILED, err });
        return err;
      });
  };
}
