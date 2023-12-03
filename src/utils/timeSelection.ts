import { setHours } from "date-fns";
import { getTimeInWeekDayHourFormatt } from "~/app/ReservationList";

export const availableHoursToPOptions = (
  availableHours: number[],
  selectedDate?: Date,
) =>
  !selectedDate
    ? []
    : availableHours.map((v) => {
        const time = setHours(selectedDate, v);
        return {
          label: getTimeInWeekDayHourFormatt(selectedDate, time),
          value: time.toString(),
        };
      });
