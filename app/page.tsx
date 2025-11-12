// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // If already logged in, go to menu
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") router.replace("/menu");
  }, [router]);

  const centerWrap = useMemo<React.CSSProperties>(
    () => ({
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "#e2e8f0",
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      padding: 16,
    }),
    []
  );

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    padding: 24,
  };

  const heading: React.CSSProperties = {
    margin: 0,
    marginBottom: 18,
    fontSize: 24,
    letterSpacing: 0.2,
    fontWeight: 700,
    textAlign: "center",
  };

  const label: React.CSSProperties = { fontSize: 12, opacity: 0.9, marginBottom: 6 };
  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "#0b1220",
    border: "1px solid #223049",
    borderRadius: 12,
    color: "#e2e8f0",
    outline: "none",
  };
  const btn: React.CSSProperties = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 14px",
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
    color: "#e5e7eb",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 0.3,
  };
  const small: React.CSSProperties = { fontSize: 12, opacity: 0.8 };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (username === "tesa" && password === "12345") {
      localStorage.setItem("loggedIn", "true");
      router.replace("/menu");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div style={centerWrap}>
      <div style={card}>
        <h1 style={heading}>Sign in</h1>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={label}>Username</div>
            <input
              style={input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div>
            <div style={label}>Password</div>
            <input
              style={input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
          <button type="submit" style={btn}>Log in</button>
          <div style={small}>Hint: <code>tesa</code> / <code>12345</code></div>
        </form>
      </div>
    </div>
  );
}
