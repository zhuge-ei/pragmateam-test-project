import { useCallback } from "react";
import { isToday, isSameDay } from "date-fns";
import clsx from "clsx";
import { isBusinessDay } from "~/utils/time";
import { type PartitionedItem } from "./helper";

export const useCalendarLogic = (
  partitionedData: Map<number, PartitionedItem[]>,
  selectedDate?: Date,
) => {
  const tileClassName = useCallback(
    ({ date }: { date: Date }) => {
      const items = partitionedData.get(date.getTime());
      const count = items?.length ?? 0;

      return clsx({
        "!border-purple-300 border": isToday(date),
        "!border-blue-300 border":
          selectedDate && isSameDay(selectedDate, date),
        "!bg-black cursor-not-allowed": !isBusinessDay(date),
        "!bg-green-200": count > 0 && count <= 3,
        "!bg-green-400": count > 3 && count <= 6,
        "!bg-green-600": count > 6,
      });
    },
    [selectedDate, partitionedData],
  );

  return tileClassName;
};
