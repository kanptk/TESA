"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

const DroneMap = dynamic(() => import("../../components/DroneMap"), { ssr: false });

const START: LatLng = { lat: 14.297567, lng: 101.166279 };

export default function OffencePage() {
  const router = useRouter();
  const [path, setPath] = useState<LatLng[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pushPoint = useCallback((lat: number, lng: number) => {
    setPath((prev) => [...prev, { lat, lng }]);
  }, []);

  useEffect(() => {
    if (!running) return;

    if (path.length === 0) setPath([START]);

    timerRef.current = setInterval(() => {
      setPath((prev) => {
        const last = prev[prev.length - 1] ?? START;
        const stepLat = Math.random() * 0.0009 + 0.0002;
        const stepLng = Math.random() * 0.0009 + 0.0002;
        return [...prev, { lat: last.lat + stepLat, lng: last.lng + stepLng }];
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const onStart = () => setRunning(true);
  const onStop = () => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const onReset = () => {
    onStop();
    setPath([]);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    router.replace("/");
  };

  const topBtnStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1220",
        color: "white",
      }}
    >
      {/* Top bar: title left, buttons right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 28px",
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.35)",
          }}
        >
          Offence
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => router.push("/menu")}
            style={topBtnStyle}
          >
            Back to Menu
          </button>
          <button onClick={logout} style={topBtnStyle}>
            Log out
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div style={{ padding: "0 28px 18px 28px" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Start = GREEN */}
          <button
            onClick={onStart}
            disabled={running}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid rgba(34,197,94,0.35)",
              background: running
                ? "rgba(34,197,94,0.55)"
                : "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
              color: "white",
              fontWeight: 800,
              opacity: running ? 0.85 : 1,
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            Start
          </button>

          {/* Stop = RED */}
          <button
            onClick={onStop}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid rgba(239,68,68,0.35)",
              background: "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Stop
          </button>

          {/* Reset = GRAY */}
          <button
            onClick={onReset}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid rgba(156,163,175,0.35)",
              background: "linear-gradient(180deg, #9ca3af 0%, #6b7280 100%)",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Map card */}
      <div style={{ padding: "0 28px 40px 28px" }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            borderRadius: 16,
            padding: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          }}
        >
          <DroneMap path={path} height={560} followLatest initialCenter={START} />
        </div>
      </div>
    </div>
  );
}
