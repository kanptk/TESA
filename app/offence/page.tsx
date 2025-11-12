"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

type LatLng = { lat: number; lng: number };

// Dynamically import to avoid SSR issues with Leaflet
const DroneMap = dynamic(() => import("@/components/DroneMap"), { ssr: false });

export default function OffencePage() {
  const [path, setPath] = useState<LatLng[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to add a new point (use this with your real drone data)
  const pushPoint = useCallback((lat: number, lng: number) => {
    setPath(prev => [...prev, { lat, lng }]);
  }, []);

  // A tiny simulator that "moves" roughly northeast in small steps
  useEffect(() => {
    if (!running) return;

    // Seed start location if empty (Bangkok-ish)
    if (path.length === 0) {
      setPath([{ lat: 13.7563, lng: 100.5018 }]);
    }

    timerRef.current = setInterval(() => {
      setPath(prev => {
        const last = prev[prev.length - 1] ?? { lat: 13.7563, lng: 100.5018 };
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

      <DroneMap path={path} height={520} followLatest />

      <div style={{ fontSize: 14, color: "#6b7280" }}>
        <p>
          <b>Tip:</b> When you have live drone coordinates, call <code>pushPoint(lat, lng)</code> (see code) each
          time you receive a new fix. The polyline and last-position marker will update automatically.
        </p>
      </div>
    </div>
  );
}
