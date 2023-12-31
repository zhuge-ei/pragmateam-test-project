import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { partitionItemsByDay } from "./helper";
import { getNextWorkingDay } from "~/utils/time";
import { addDays, getHours, isFuture, isSameDay, isToday } from "date-fns";

export const useReservationData = (name?: string | null) => {
  const { isLoading, data, refetch } =
    api.getReservationsForAMonth.useQuery(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const partitionedData = useMemo(
    () => partitionItemsByDay(data ?? []),
    [data],
  );
  const reservationsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return [
      ...(partitionedData.get(selectedDate.getTime()) ?? []),
      ...(partitionedData
        .get(getNextWorkingDay(selectedDate).getTime())
        ?.filter(
          ({ start }) =>
            !isSameDay(start, selectedDate) && getHours(start) < 11,
        ) ?? []),
    ];
  }, [selectedDate, partitionedData]);

  const canReserve = useMemo(() => {
    if (!selectedDate) return false;
    if (
      name &&
      reservationsForSelectedDate.some(
        (reservation) =>
          reservation.name === name &&
          (isSameDay(reservation.start, selectedDate) ||
            isSameDay(reservation.end, selectedDate)),
      )
    )
      return false;

    return isFuture(selectedDate) || isToday(selectedDate);
  }, [selectedDate, reservationsForSelectedDate, name]);
  const hasReservedTomorrow = useMemo(() => {
    if (!selectedDate) return false;
    const dayAfterSelectedDay = addDays(selectedDate, 1);
    if (
      (
        partitionedData.get(getNextWorkingDay(selectedDate).getTime()) ?? []
      ).some(
        (reservation) =>
          reservation.name === name &&
          (isSameDay(reservation.start, dayAfterSelectedDay) ||
            isSameDay(reservation.end, dayAfterSelectedDay)),
      )
    )
      return true;

    return false
  }, [selectedDate, reservationsForSelectedDate, name]);
  return {
    isLoading,
    selectedDate,
    setSelectedDate,
    reservationsForSelectedDate,
    canReserve,
    hasReservedTomorrow,
    refetch,
    partitionedData,
  };
};
