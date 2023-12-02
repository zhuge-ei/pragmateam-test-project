import { test, expect } from "@jest/globals";
import { appRouter } from "../root";
import type { AppRouter } from "../root";
import type { inferProcedureInput } from "@trpc/server";
import { db } from "~/server/db";

test("hello test", async () => {
  const caller = appRouter.createCaller({ session: null, db: db });

  type Input = inferProcedureInput<AppRouter["example"]["hello"]>;

  const input: Input = {
    text: "test",
  };

  const result = await caller.example.hello(input);

  expect(result).toStrictEqual({ greeting: "Hello test" });
});
