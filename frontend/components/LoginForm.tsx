"use client";

import React, { useState } from "react";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password }, () => router.push("/"));
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headerStyle}>Login</h2>
      {error && <div style={errorStyle}>{error}</div>}
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Username</label>
        <input
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Password</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        style={{
          ...buttonStyle,
          ...(loading ? buttonDisabledStyle : {}),
        }}
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
