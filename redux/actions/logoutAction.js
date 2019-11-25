import {
    LOGOUT,
    LOGOUT_FAILED,
    LOGOUT_SUCCESS
  } from "../actions/types";
import AsyncStorage from '@react-native-community/async-storage'
  export default async function logout() {
    console.log("FIRE LOGOUT!");
    return dispatch => {
        dispatch({ type: LOGOUT });
        try {
            const user = null
            const uid = null
            AsyncStorage.clear();
            dispatch({ type: LOGOUT_SUCCESS, payload:{user, uid }});
            return true
        } catch (err) {
            dispatch({ type: LOGOUT_FAILED, err });
            return false
        }
    };
  }