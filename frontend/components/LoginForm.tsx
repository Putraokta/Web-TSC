"use client";

import React from "react";
import { Controller } from "react-hook-form";
import useLogin from "@/hooks/useLogin";

const formStyle: React.CSSProperties = {
  maxWidth: 400,
  margin: "0 auto",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  background: "#ffffff",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 16,
  color: "#333",
};

const errorStyle: React.CSSProperties = {
  color: "red",
  marginBottom: 8,
  fontSize: "0.9em",
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 4,
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
  transition: "border 0.3s",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  border: "none",
  borderRadius: 4,
  backgroundColor: "#0070f3",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
  transition: "background 0.3s",
};

const buttonDisabledStyle: React.CSSProperties = {
  backgroundColor: "#ccc",
};

export default function LoginForm() {
  const { control, errors, handlerSignIn, isPendingSignIn } = useLogin();

  return (
    <form onSubmit={handlerSignIn} style={formStyle}>
      <h2 style={headerStyle}>Login</h2>
      {errors.root && <div style={errorStyle}>{errors.root.message}</div>}

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Username</label>
        <Controller name="username" control={control} render={({ field }) => <input {...field} style={inputStyle} placeholder="Masukkan username" />} />
        {errors.username && <div style={errorStyle}>{errors.username.message}</div>}
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Password</label>
        <Controller name="password" control={control} render={({ field }) => <input {...field} style={inputStyle} type="password" placeholder="Masukkan password" />} />
        {errors.password && <div style={errorStyle}>{errors.password.message}</div>}
      </div>

      <button
        style={{
          ...buttonStyle,
          ...(isPendingSignIn ? buttonDisabledStyle : {}),
        }}
        type="submit"
        disabled={isPendingSignIn}
      >
        {isPendingSignIn ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
