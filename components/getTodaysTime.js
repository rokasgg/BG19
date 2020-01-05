export const getTodaysTime = () => {
  let today = new Date();

  let time = {
    hours: today.getUTCHours() + 2,
    minutes: today.getUTCMinutes(),
    seconds: today.getUTCSeconds()
  };
  let minutes = time.minutes < 10 ? `${0}${time.minutes}` : time.minutes;
  let hours = time.hours < 10 ? `${0}${time.hours}` : time.hours;
  let formatedTime = `${hours}:${minutes}`;
  if(hours==24)
  formatedTime =`00:${minutes}`
  return formatedTime;
};
