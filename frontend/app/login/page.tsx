import React, { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-white/60 text-center text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
