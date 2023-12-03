import { TRPCError } from "@trpc/server";
import { setupSeedUsers } from "../__test__/seeds/users";
import {
  addDays,
  addHours,
  addMonths,
  setDay,
  setHours,
  subHours,
} from "date-fns";
import { getCaller } from "../__test__/helper";

describe("Reservation", () => {
  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-11-06T13:00:00Z"));
    await setupSeedUsers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("Timezones", () => {
    it("should always be UTC", () => {
      expect(new Date().getTimezoneOffset()).toBe(0);
    });
  });

  it("Should return empty reservation list for Nov2033", async () => {
    const result = await getCaller().getReservationsForAMonth();
    expect(result).toHaveLength(0);
  });
  describe("Reservation Input Schema", () => {
    it("Should reject invalid start/end type", async () => {
      expect.assertions(1);
      try {
        await getCaller().reserve({ start: 12345, end: {} });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("Should reject past start date", async () => {
      expect.assertions(1);
      try {
        const oneHourAgo = subHours(new Date(), 1);
        await getCaller().reserve({ start: oneHourAgo, end: new Date() });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("Should reject start date outside current month", async () => {
      expect.assertions(1);
      try {
        const nextMonth = addMonths(new Date(), 1);
        await getCaller().reserve({
          start: nextMonth,
          end: addHours(nextMonth, 1),
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("Should reject times outside business hours", async () => {
      expect.assertions(1);
      try {
        const oneHourAfterBH = setHours(new Date(), 18);
        await getCaller().reserve({
          start: oneHourAfterBH,
          end: addHours(oneHourAfterBH, 1),
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });
    it("Should reject times outside business hours", async () => {
      expect.assertions(1);
      try {
        const friday = setDay(new Date(), 5);
        await getCaller().reserve({
          start: friday,
          end: addDays(friday, 1),
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("Should reject end date before start date", async () => {
      expect.assertions(1);
      try {
        const oneHourAgo = subHours(new Date(), 1);
        await getCaller().reserve({
          start: new Date(),
          end: oneHourAgo,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("Should reject end date beyond next working day at 11 AM", async () => {
      expect.assertions(1);
      try {
        const tomorrow = addDays(new Date(), 1);

        await getCaller().reserve({
          start: new Date(),
          end: tomorrow,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });
  });
  describe("reserve function", () => {
    let now: Date,
      twoHoursFromNow: Date,
      oneHourFromNow: Date,
      tomorrow11AM: Date,
      tomorrow13PM: Date,
      tomorrow15PM: Date;

    beforeAll(() => {
      now = new Date();
      twoHoursFromNow = addHours(now, 2);
      oneHourFromNow = addHours(now, 1);
      tomorrow11AM = setHours(addDays(now, 1), 11);
      tomorrow13PM = setHours(addDays(now, 1), 13);
      tomorrow15PM = setHours(addDays(now, 1), 15);
    });
    it("Un-named user tries to reserve without name and fails", async () => {
      expect.assertions(1);
      try {
        await getCaller(3).reserve({ start: tomorrow13PM, end: tomorrow15PM });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("BAD_REQUEST");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });
    it("Un-named user tries again wille passing the name and succeed", async () => {
      const result = await getCaller(3).reserve({
        start: tomorrow13PM,
        end: tomorrow15PM,
        name: "User 3",
      });
      expect(result).toHaveProperty(
        "message",
        "Reservation successfully created.",
      );
    });
    it("User 0 successfully reserves a time slot from two hours from now to tomorrow's 11 AM", async () => {
      const result = await getCaller(0).reserve({
        start: twoHoursFromNow,
        end: tomorrow11AM,
      });
      expect(result).toHaveProperty(
        "message",
        "Reservation successfully created.",
      );
    });

    it("User 0 tries to reserve for today from now to one hour from now and should fail", async () => {
      expect.assertions(1);
      try {
        await getCaller(0).reserve({ start: now, end: oneHourFromNow });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("FORBIDDEN");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("User 0 tries to reserve for tomorrow from 11AM to 1PM and should fail", async () => {
      expect.assertions(1);
      try {
        await getCaller(0).reserve({ start: tomorrow11AM, end: tomorrow13PM });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("FORBIDDEN");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });

    it("User 2 should be able to reserve from now to one hour from now", async () => {
      const result = await getCaller(2).reserve({
        start: now,
        end: oneHourFromNow,
      });
      expect(result).toHaveProperty(
        "message",
        "Reservation successfully created.",
      );
    });

    it("User 2 should be able to reserve from tomorrow 11AM to 1PM", async () => {
      const result = await getCaller(2).reserve({
        start: tomorrow11AM,
        end: tomorrow13PM,
      });
      expect(result).toHaveProperty(
        "message",
        "Reservation successfully created.",
      );
    });

    it("User 1 tries to reserve from today 13 to tomorrow 11AM and fails", async () => {
      expect.assertions(1);
      try {
        await getCaller(1).reserve({
          start: twoHoursFromNow,
          end: tomorrow11AM,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("CONFLICT");
        } else {
          fail("Error should be an instance of TRPCError");
        }
      }
    });
  });
});
