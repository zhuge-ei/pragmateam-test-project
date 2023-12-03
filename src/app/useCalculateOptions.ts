import {
  differenceInCalendarDays,
  getHours,
  isSameDay,
  isToday,
} from "date-fns";
import range from "lodash.range";
import remove from "lodash.remove";
import { useMemo } from "react";
import { getNextWorkingDay } from "~/utils/time";

export const useCalculateOptions = (
  canReserve: boolean,
  reservationsForSelectedDate: any[],
  selectedDate?: Date ,
  selectedStart?: Date,
) => {
  const startOptions = useMemo(() => {
    if (!canReserve) return [];
    if (!selectedDate) return [];
    const startOfRange = isToday(selectedDate) ? getHours(new Date()) : 9;
    if (startOfRange >= 18) return [];
    let options = range(startOfRange, 18);

    for (const reservation of reservationsForSelectedDate) {
      if (!isSameDay(reservation.start, selectedDate)) continue;
      const startHour = getHours(reservation.start);
      const endHour = getHours(reservation.end);
      options = remove(options, (v) => !(v >= startHour && v < endHour));
    }

    return options;
  }, [canReserve, selectedDate, reservationsForSelectedDate]);
  const endOptions = useMemo(() => {
    if (!selectedStart || startOptions.length === 0) return [];
    const selectedHour = getHours(new Date(selectedStart));
    let lastPossibleOptionIndex;
    for (
      lastPossibleOptionIndex = 1;
      lastPossibleOptionIndex < startOptions.length;
      lastPossibleOptionIndex++
    ) {
      if (startOptions[lastPossibleOptionIndex]! <= selectedHour) continue;
      if (
        startOptions[lastPossibleOptionIndex]! -
          startOptions[lastPossibleOptionIndex - 1]! >
        1
      )
        break;
    }
    lastPossibleOptionIndex--;
    if (
      startOptions[lastPossibleOptionIndex]! -
        startOptions[lastPossibleOptionIndex - 1]! >
      1
    )
      lastPossibleOptionIndex--;

    const options = range(
      selectedHour,
      startOptions[lastPossibleOptionIndex],
    ).map((v) => v + 1);

    if (startOptions[lastPossibleOptionIndex] !== 17) return options;
    let tommorowOptions = [10, 11];
    for (const reservation of reservationsForSelectedDate) {
      if (isSameDay(reservation.start, selectedDate!)) continue;
      const startHour = getHours(reservation.start);
      tommorowOptions = remove(options, (v) => !(v >= startHour));
    }
    const differenceInDay = differenceInCalendarDays(
      getNextWorkingDay(selectedDate!),
      selectedDate!,
    );
    return [
      ...options,
      ...tommorowOptions.map((v) => v + differenceInDay * 24),
    ];
  }, [startOptions, selectedStart]);
  return { startOptions, endOptions };
};
