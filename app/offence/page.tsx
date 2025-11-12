"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

type LatLng = { lat: number; lng: number };

// Use relative path based on your folder layout
const DroneMap = dynamic(() => import("../../components/DroneMap"), { ssr: false });

// ✅ fixed start coordinates
const START: LatLng = { lat: 14.297567, lng: 101.166279 };

export default function OffencePage() {
  const router = useRouter();
  const [path, setPath] = useState<LatLng[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call this with real drone fixes when you hook up your feed
  const pushPoint = useCallback((lat: number, lng: number) => {
    setPath(prev => [...prev, { lat, lng }]);
  }, []);

  // Simple simulator so you can see the tracking line
  useEffect(() => {
    if (!running) return;

    if (path.length === 0) setPath([START]);

    timerRef.current = setInterval(() => {
      setPath(prev => {
        const last = prev[prev.length - 1] ?? START;
        const stepLat = (Math.random() * 0.0009) + 0.0002;
        const stepLng = (Math.random() * 0.0009) + 0.0002;
        const next = { lat: last.lat + stepLat, lng: last.lng + stepLng };
        return [...prev, next];
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

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      {/* Back button */}
      <button
        onClick={() => router.back()} // or router.push("/menu")
        style={{
          width: "fit-content",
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Offence — Drone Map Tracking</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={onStart}
          disabled={running}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: running ? "#9ca3af" : "#111827",
            color: "white",
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          Start
        </button>

        <button
          onClick={onStop}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: "#374151",
            color: "white",
            cursor: "pointer",
          }}
        >
          Stop
        </button>

        <button
          onClick={onReset}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {/* Map uses your start center by default; still passed explicitly */}
      <DroneMap path={path} height={520} followLatest initialCenter={START} />

      <div style={{ fontSize: 14, color: "#6b7280" }}>
        <p>
          When connected to your drone, call <code>pushPoint(lat, lng)</code> for each new GPS fix.
        </p>
      </div>
    </div>
  );
}
