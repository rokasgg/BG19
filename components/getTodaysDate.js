export const getTodaysDate = () => {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  let year = today.getFullYear();
  let todayIs = `${year}-${month}-${day}`;
  console.log("Siandien yra", todayIs);
  return todayIs;
};
