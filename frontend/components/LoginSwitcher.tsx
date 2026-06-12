"use client";

import { useState, Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import LoginFormCoach from "@/components/LoginFormCoach";

export default function LoginSwitcher() {
  const [loginType, setLoginType] = useState<"pengurus" | "coach">("pengurus");

  return (
    <div className="w-full">
      {/* Switch Button */}
      <div className="flex mb-6 rounded-xl bg-white/5 p-1 border border-white/10">
        <button
          type="button"
          onClick={() => setLoginType("pengurus")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            loginType === "pengurus"
              ? "bg-violet-600 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Login Pengurus
        </button>

        <button
          type="button"
          onClick={() => setLoginType("coach")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            loginType === "coach"
              ? "bg-violet-600 text-white"
              : "text-white/70 hover:text-white"
          }`}
        >
          Login Pelatih
        </button>
      </div>

      {/* Form */}
      <Suspense
        fallback={
          <div className="text-white/60 text-center text-sm">
            Loading...
          </div>
        }
      >
        {loginType === "pengurus" ? (
          <LoginForm />
        ) : (
          <LoginFormCoach />
        )}
      </Suspense>
    </div>
  );
}