import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCESS
} from "../actions/types";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";

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
  return dispatch => {
    dispatch({ type: AUTHENTICATE });
    return firebase
      .auth()
      .signInWithEmailAndPassword(userName, password)
      .then(response => {
        const user = response.user.email;
        const uid = response.user.uid;
        if (isRemembered) {
          saveUserInfo(userName, password, isRemembered).then(() => {
            dispatch({ type: AUTHENTICATE_SUCCESS, payload: { user, uid } });
          });
        } else {
          dispatch({ type: AUTHENTICATE_SUCCESS, payload: { user, uid } });
        }
        return true;
      })
      .catch(err => {
        console.log("AUTHENTICATE_FAILED");
        dispatch({ type: AUTHENTICATE_FAILED, err });
        return err;
      });
  };
}
