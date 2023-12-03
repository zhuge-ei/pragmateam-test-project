import { getServerAuthSession } from "~/server/auth";
import CalendarForm from "./CalendarForm";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {session ? (
          <CalendarForm name={session.user.name} />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-2xl text-white">
              <span>Please login to continue...</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
