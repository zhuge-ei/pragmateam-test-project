import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import { type RouterOutputs } from "~/trpc/shared";

export interface FlatReservation {
  name: string;
  start: Date;
  end: Date;
}

export const partitionItemsByDay = (
  reservations: RouterOutputs["getReservationsForAMonth"],
): Map<number, FlatReservation[]> => {
  const partitionedItems = new Map<number, FlatReservation[]>();
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  eachDayOfInterval({ start, end }).forEach((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const itemsForDay = reservations
      .filter((reservation) => {
        return (
          isWithinInterval(new Date(reservation.start), {
            start: dayStart,
            end: dayEnd,
          }) ||
          isWithinInterval(new Date(reservation.end), {
            start: dayStart,
            end: dayEnd,
          })
        );
      })
      .map((reservation) => ({
        name: reservation.owner.name!,
        start: new Date(reservation.start),
        end: new Date(reservation.end),
      }));
    partitionedItems.set(day.getTime(), itemsForDay);
  });
  return partitionedItems;
};
