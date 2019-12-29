import {
  REGISTRATION,
  REGISTRATION_FAILED,
  REGISTRATION_SUCCESS
} from "../actions/types";
import firebase from "firebase";

export default function register(email, password, userName, position) {
  console.log("FIRE!");
  return dispatch => {
    dispatch({ type: REGISTRATION });
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        console.log("REG RESPONSE", response);
        const constEmail = response.user.email;
        const usersData = {
          name: userName,
          email: email,
          position: position,
          admin: false,
          administrator: false
        };
        const admin = false;
        const userId = response.user.uid;
        dispatch({
          type: REGISTRATION_SUCCESS,
          payload: { email, userName, position, userId, admin }
        });
        firebase
          .firestore()
          .collection("users")
          .doc(`${userId}`)
          .set(usersData);
        return true;
      })
      .catch(err => {
        console.log("AUTHENTICATE_FAILED");
        dispatch({ type: REGISTRATION_FAILED, err });
        return err;
      });
  };
}
