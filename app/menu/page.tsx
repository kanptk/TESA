// app/menu/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Simple auth guard
  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") router.replace("/");
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

  const btn: React.CSSProperties = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 16px",
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
    color: "#e5e7eb",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 0.3,
    fontSize: 18,
  };

  function logout() {
    localStorage.removeItem("loggedIn");
    router.replace("/");
  }

  return (
    <div style={centerWrap}>
      <div style={card}>
        <h1 style={heading}>Main Menu</h1>

        <div style={{ display: "grid", gap: 10 }}>
          <button style={btn} onClick={() => router.push("/offence")}>
            <span style={{ textAlign: "center", width: "100%" }}>Offence</span>
          </button>
          <button style={btn} onClick={() => router.push("/defence")}>
            <span style={{ textAlign: "center", width: "100%" }}>Defence</span>
          </button>
          <button style={btn} onClick={() => router.push("/battlefield")}>
            <span style={{ textAlign: "center", width: "100%" }}>Battle Field</span>
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <button style={btn} onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  );
}
