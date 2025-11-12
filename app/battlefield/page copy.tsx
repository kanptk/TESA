"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") router.replace("/");
  }, [router]);

  const btn: React.CSSProperties = {
    padding: "10px 12px",
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
    color: "#e5e7eb",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#e2e8f0" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "#111827", border: "1px solid #1f2937", borderRadius: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.35)", padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 18, fontSize: 24, fontWeight: 700, textAlign: "center" }}>Battle Field</h1>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button style={{ ...btn, flex: 1 }} onClick={() => router.push("/menu")}>Back to Menu</button>
          <button
            style={{ ...btn, flex: 1 }}
            onClick={() => { localStorage.removeItem("loggedIn"); router.replace("/"); }}
          >
            Log out
          </button>
        </div>
        <p style={{ fontSize: 13, opacity: 0.85 }}>This is the Battle Field page. Put your content here.</p>
      </div>
    </div>
  );
}