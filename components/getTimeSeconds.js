export const getTimeSeconds = () => {
  let today = new Date();

  let time = {
    hours: today.getUTCHours() + 2,
    minutes: today.getUTCMinutes(),
    seconds: today.getUTCSeconds()
  };
  let minutes = time.minutes < 10 ? `${0}${time.minutes}` : time.minutes;
  let hours = time.hours < 10 ? `${0}${time.hours}` : time.hours;
  let seconds = time.seconds < 10 ? `${0}${time.seconds}` : time.seconds;
  let formatedTime = `${hours}:${minutes}:${seconds}`;
  return formatedTime;
};
