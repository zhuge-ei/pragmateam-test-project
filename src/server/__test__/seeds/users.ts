import { type User, type Prisma } from "@prisma/client";
import { db } from "~/server/db";

export const seedUsersInput: Prisma.UserCreateInput[] = [
  {
    name: "User 0",
  },
  {
    name: "User 1",
  },
  {
    name: "User 2",
  },
  {}
];

let seedUsers: User[];
export const setupSeedUsers = async () => {
  if (seedUsers) return;
  
  await db.user.createMany({ data: seedUsersInput });
  seedUsers = await db.user.findMany({ orderBy: { name: { sort: "asc" } } });
};
export const getSeedUsers = () => {
  return seedUsers;
};

export const getSeedUserZero = () => {
  return seedUsers[0]!;
};
