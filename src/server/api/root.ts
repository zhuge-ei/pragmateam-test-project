import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "../db";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { reserveInputSchema } from "./input.schema";
import { TRPCError } from "@trpc/server";
import { roundToHour } from "~/utils/time";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getReservationsForAMonth: protectedProcedure.query(async () => {
    const now = new Date();

    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);
    return await db.reservation.findMany({
      where: {
        OR: [
          { start: { gte: startDate, lte: endDate } },
          { end: { gte: startDate, lte: endDate } },
        ],
      },
      select: { end: true, start: true, owner: { select: { name: true } } },
    });
  }),
  reserve: protectedProcedure
    .input(reserveInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.name) {
        if (!input.name)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User name is required. Please provide a name.",
          });
        await db.user.update({
          where: { id: ctx.session.user.id },
          data: { name: input.name },
        });
      }

      const startOfDayValue = startOfDay(input.start);
      const endOfDayValue = endOfDay(input.end);
      const isUserAllowedToReserve = !(await db.reservation.findFirst({
        where: {
          OR: [
            { start: { gte: startOfDayValue, lte: endOfDayValue } },
            { end: { gte: startOfDayValue, lte: endOfDayValue } },
          ],
          owner: { id: ctx.session.user.id },
        },
        select: { end: true, start: true, owner: { select: { name: true } } },
      }));
      if (!isUserAllowedToReserve) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already reserved a time for this day.",
        });
      }
      const normalizedStart = roundToHour(input.start);
      const normalizedEnd = roundToHour(input.end);
      const isReservationValid = !(await db.reservation.findFirst({
        where: {
          OR: [
            {
              start: { gte: normalizedStart, lt: normalizedEnd },
              end: { gt: normalizedStart, lte: normalizedEnd },
            },
          ],
        },
      }));
      if (!isReservationValid) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "The requested reservation time is not available.",
        });
      }
      await db.reservation.create({
        data: {
          owner: { connect: { id: ctx.session.user.id } },
          start: normalizedStart,
          end: normalizedEnd,
        },
      });
      return { message: "Reservation successfully created." };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
