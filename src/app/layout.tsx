import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import Link from "next/link";
import Button from "./_components/button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Pragmateam hiring test project",
  description: "Car Reservation Project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <nav className="border-gray-200 bg-white dark:bg-gray-900">
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
              <a
                href="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <Image
                  src={"/logo.png"}
                  height={32}
                  width={32}
                  alt="Brand Logo"
                />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  CarReservation
                </span>
              </a>

              <div className="flex space-x-3 rtl:space-x-reverse md:order-2 md:space-x-0">
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  <Button label={session ? "Logout" : "Login"} />
                </Link>
              </div>
            </div>
          </nav>

          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
