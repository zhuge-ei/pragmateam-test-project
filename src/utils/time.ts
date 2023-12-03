export const roundToHour = (date: Date) => {
  const roundedDate = new Date(date);
  roundedDate.setMinutes(0, 0, 0);
  return roundedDate;
};
export const isWithinBusinessHours = (date: Date) => {
  const day = date.getDay();
  const hours = date.getHours();
  return day >= 1 && day <= 5 && hours >= 9 && hours <= 17; // Monday to Friday, 9 AM to 5 PM
};
export const isBusinessDay = (date: Date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

export const isWithinCurrentMonth = (date: Date) => {
  const now = new Date();
  return (
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  );
};

export const getNextWorkingDay = (date: Date) => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  return nextDay;
};
