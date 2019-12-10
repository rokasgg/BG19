export const formateTime = time => {
  let formatedData = {
    startTime: "",
    finishTime: ""
  };

  switch (time) {
    case "08-10":
      {
        (formatedData.startTime = "8:00"), (formatedData.finishTime = "10:00");
      }
      break;
    case "10-12":
      {
        (formatedData.startTime = "10:00"), (formatedData.finishTime = "12:00");
      }
      break;
    case "12-14":
      {
        (formatedData.startTime = "12:00"), (formatedData.finishTime = "14:00");
      }
      break;
    case "14-16":
      {
        (formatedData.startTime = "14:00"), (formatedData.finishTime = "16:00");
      }
      break;
    case "16-18":
      {
        (formatedData.startTime = "16:00"), (formatedData.finishTime = "18:00");
      }
      break;
    case "18-20":
      {
        (formatedData.startTime = "18:00"), (formatedData.finishTime = "20:00");
      }
      break;
    case "20-22":
      {
        (formatedData.startTime = "20:00"), (formatedData.finishTime = "22:00");
      }
      break;
  }
  return formatedData;
};
