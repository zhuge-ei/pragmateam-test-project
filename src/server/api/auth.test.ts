import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { appRouter } from "./root";

describe("AUTH", () => {
  it("Should throw UNAUTHORIZED error for anonymous users", async () => {
    expect.assertions(1);
    const caller = appRouter.createCaller({ session: null, db });

    try {
      await caller.getReservationsForAMonth();
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("UNAUTHORIZED");
      } else {
        fail("Error should be an instance of TRPCError");
      }
    }
  });
});
