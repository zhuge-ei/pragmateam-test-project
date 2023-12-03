import { appRouter } from "../api/root";
import { db } from "../db";
import { getSeedUserZero, getSeedUsers } from "./seeds/users";

export const getCaller = (userIndex?: number) => {
  return appRouter.createCaller({
    session: {
      user: userIndex ? getSeedUsers()[userIndex]! : getSeedUserZero(),
      expires: new Date().toISOString(),
    },
    db,
  });
};
