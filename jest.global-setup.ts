import { execSync } from "child_process";
module.exports = async () => {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log("Global setup: Prisma migrations applied");
  process.env.TZ = "UTC";
};
