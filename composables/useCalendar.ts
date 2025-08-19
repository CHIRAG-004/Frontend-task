const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Day = (typeof DAYS)[number];
type MonthName = (typeof MONTHS)[number];

export type Month = {
  date: number;
  day: Day;
  month: MonthName;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

const getNumberOfDays = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const getMonthDetails = (year: number, month: number): Month[] => {
  const numberOfDays = getNumberOfDays(year, month);
  const monthDetails: Month[] = [];
  const currentDate = new Date();

  // Add current month dates
  for (let day = 1; day <= numberOfDays; day++) {
    const date = new Date(year, month - 1, day);
    monthDetails.push({
      date: day,
      day: DAYS[date.getDay()],
      month: MONTHS[date.getMonth()],
      isCurrentMonth:
        date.getDate() >= currentDate.getDate() ||
        date.getMonth() !== currentDate.getMonth(),
      isToday:
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear(),
      isSelected: false,
    });
  }

  // Add previous month dates
  let firstDayIndex = 0;
  for (let i = DAYS.indexOf(monthDetails[0].day); i > 0; i--) {
    const tempDate = new Date(year, month - 1, firstDayIndex--);
    monthDetails.unshift({
      date: tempDate.getDate(),
      day: DAYS[tempDate.getDay()],
      month: MONTHS[tempDate.getMonth()],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  // Add next month dates
  let lastDayIndex = monthDetails[monthDetails.length - 1].date + 1;
  for (
    let i = DAYS.indexOf(monthDetails[monthDetails.length - 1].day);
    i < 6;
    i++
  ) {
    const tempDate = new Date(year, month - 1, lastDayIndex++);
    monthDetails.push({
      date: tempDate.getDate(),
      day: DAYS[tempDate.getDay()],
      month: MONTHS[tempDate.getMonth()],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  return monthDetails;
};

export const useCalendar = (year: number, month: number): Month[] => {
  return getMonthDetails(year, month);
};
