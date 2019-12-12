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
        console.log(response, 'LOGINO RES')
        const user = response.user.email;
        const uid = response.user.uid;
        firebase.firestore().collection('users').doc(uid).get().then((snap)=>{
          let name=snap._document.proto.fields.name.stringValue;
          let position=snap._document.proto.fields.position.stringValue;
        if (isRemembered) {
          saveUserInfo(userName, password, isRemembered).then(() => {
            dispatch({ type: AUTHENTICATE_SUCCESS, payload: { user, uid, name,position } });
          });
        } else {
          dispatch({ type: AUTHENTICATE_SUCCESS, payload: { user, uid, name,position } });
        }})
        return true;
      })
      .catch(err => {
        console.log("AUTHENTICATE_FAILED");
        dispatch({ type: AUTHENTICATE_FAILED, err });
        return err;
      });
  };
}
