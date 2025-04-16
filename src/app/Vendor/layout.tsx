"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== "VENDOR" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session?.user?.role !== "VENDOR" && session?.user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
