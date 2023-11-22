"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PiPlant } from "react-icons/pi";
import Link from "next/link";

export default function Navbar() {
  const [isOnDashboard, setIsOnDashboard] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOnDashboard(pathname === "/dashboard");
  }, [pathname]);

  return (
    <div className=" flex justify-between items-center p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <PiPlant className="text-logo-secondary h-16 w-16" />
        <p className="text-logo-primary text-4xl">plant</p>
        <p className="text-logo-secondary text-4xl">stats</p>
      </div>
      {!isOnDashboard && (
        <Link
          href="/dashboard"
          className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
        >
          Dashboard
        </Link>
      )}
      {isOnDashboard && (
        <Link
          href="/"
          className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
        >
          Realtime
        </Link>
      )}
    </div>
  );
}
