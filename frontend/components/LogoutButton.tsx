"use client"

import React from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LogoutButton({ children }: { children?: React.ReactNode }) {
  const { logout, loading } = useAuth();
  const router = useRouter();

  const handle = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button onClick={handle} disabled={loading}>
      {children || (loading ? "Logging out..." : "Logout")}
    </button>
  );
}
