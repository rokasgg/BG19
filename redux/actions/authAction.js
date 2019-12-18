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
            console.log("id", snap.id);
            const name = snap._document.proto.fields.name.stringValue;
            const position = snap._document.proto.fields.position.stringValue;
            const admin = snap._document.proto.fields.admin.booleanValue;
            firebase
              .firestore()
              .collection("bannedUsers")
              .where("userId", "==", snap.id)
              .where("banDate", ">=", today)
              .orderBy("banDate")
              .get()
              .then(res => {
                let banDate = null;
                let banTime = null;
                if (res.docs.length > 0) {
                  banDate =
                    res.docs[0]._document.proto.fields.banDate.stringValue;
                  banTime =
                    res.docs[0]._document.proto.fields.banTime.stringValue;
                  if (nowTime >= banTime) {
                    (banDate = null), (banTime = null);
                  }
                }

                if (isRemembered) {
                  saveUserInfo(userName, password, isRemembered).then(() => {
                    dispatch({
                      type: AUTHENTICATE_SUCCESS,
                      payload: {
                        user,
                        uid,
                        name,
                        position,
                        banDate,
                        banTime,
                        admin
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
                      position,
                      banDate,
                      banTime,
                      admin
                    }
                  });
                }
              });
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
