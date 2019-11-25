export { SET_TEXT } from "./types";

export const dummyAction = data => {
  return {
    types: SET_TEXT,
    payload: {
      data
    }
  };
};
