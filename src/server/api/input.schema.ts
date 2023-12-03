import { z } from "zod";
import {
  getNextWorkingDay,
  isWithinBusinessHours,
  isWithinCurrentMonth,
  roundToHour,
} from "~/utils/time";

export const reserveInputSchema = z
  .object({
    start: z.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) {
        return new Date(arg);
      }
    }, z.date()),
    end: z.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) {
        return new Date(arg);
      }
    }, z.date()),
    name: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const now = roundToHour(new Date());
    const normalizedStart = roundToHour(new Date(data.start));
    const normalizedEnd = roundToHour(new Date(data.end));

    if (normalizedStart < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],
        message: "Start date must be in the future",
      });
    } else if (!isWithinCurrentMonth(normalizedStart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],
        message: "Start date must be within the current month",
      });
    }

    if (!isWithinBusinessHours(normalizedStart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],
        message:
          "Start and end times must be between 9 AM and 5 PM on workdays",
      });
    }

    if (!isWithinBusinessHours(normalizedEnd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message:
          "Start and end times must be between 9 AM and 5 PM on workdays",
      });
    }
    if (normalizedEnd <= normalizedStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start", "end"],
        message: "End date must be larger than start date",
      });
    }

    const maxEndTime = getNextWorkingDay(normalizedStart);
    maxEndTime.setHours(11, 0, 0, 0);

    if (normalizedEnd > maxEndTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message: "End date must be at most the next working day at 11 AM",
      });
    }
  });
