"use client";

import React from "react";
import LoginForm from "@/components/LoginForm";

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", /* Full height of the viewport */
  backgroundColor: "#f5f5f5", /* Light gray background */
};

export default function LoginPage() {
  return (
    <div style={containerStyle}>
      <LoginForm />
    </div>
  );
}
