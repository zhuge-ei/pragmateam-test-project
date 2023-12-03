import React from "react";
import { type FlatReservation } from "./helper";
import { format, isSameDay } from "date-fns";

export const getTimeInWeekDayHourFormatt = (selectedDate: Date, time: Date) =>
  isSameDay(selectedDate, time)
    ? format(time, "HH a")
    : format(time, "EEEE HH a");


const ReservationList = ({
  selectedDate,
  data,
}: {
  selectedDate: Date;
  data: FlatReservation[];
}) => {
  return (
    <div>
      {data
        .filter(
          ({ start, end }) =>
            isSameDay(selectedDate, start) || isSameDay(selectedDate, end),
        )
        .map(({ end, name, start }) => (
          <p key={start.getTime()}>
            {name}: {getTimeInWeekDayHourFormatt(selectedDate, start)} -
            {getTimeInWeekDayHourFormatt(selectedDate, end)}
          </p>
        ))}
    </div>
  );
};

export default ReservationList;
