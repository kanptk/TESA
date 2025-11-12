"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** Known cameras + tokens (your values) */
const KNOWN = {
  offence: {
    id: "d03e2707-90ef-46f9-9767-19a000cd7bb7",
    token:
      "3b9324edad943dde80fc57cc5ebdb21c036ad604a3b63a07812539a4285fc869",
  },
  defence: {
    id: "12226b96-6eb5-4422-87de-7af4caf86a98",
    token:
      "0987ed350629744ec8a50b42db88db33add59b5fccb8cbdeef2e8e3e8528660b",
  },
};
type TeamKey = "offence" | "defence" | "unknown";

type PanelState = {
  cameraId: string;
  token: string;
  connected: boolean;
  detections: number;
};

const emptyPanel: PanelState = {
  cameraId: "",
  token: "",
  connected: false,
  detections: 0,
};

const UI = {
  outerBg: "#0f172a",
  cardBg: "#111827",
  border: "#1f2937",
  text: "#e2e8f0",
};

const btnBase: React.CSSProperties = {
  padding: "10px 12px",
  border: `1px solid ${UI.border}`,
  background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
  color: "#e5e7eb",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 600,
};

const label: React.CSSProperties = { fontSize: 13, marginBottom: 6, color: "#cbd5e1" };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #303a4c",
  background: "#0b1220",
  color: "#e5e7eb",
  outline: "none",
};

function Ribbon({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: "14px 16px",
        borderRadius: 12,
        fontWeight: 800,
        textAlign: "center",
        marginBottom: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>
  );
}

function OSMEmbed({
  lat = 14.297567,
  lon = 101.166279,
  zoom = 15,
}: {
  lat?: number;
  lon?: number;
  zoom?: number;
}) {
  // Zoomable OpenStreetMap iframe (no libs/keys)
  const bboxPad = 0.01;
  const bbox = [lon - bboxPad, lat - bboxPad, lon + bboxPad, lat + bboxPad].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}&zoom=${zoom}`;
  return (
    <iframe
      title="Detection Map"
      src={src}
      style={{ width: "100%", height: 360, border: 0, borderRadius: 10 }}
      loading="lazy"
    />
  );
}

/* ---------- Expanded panel (after CONNECT) ---------- */
function ExpandedPanel({
  team,
  state,
  onChange,
  onDisconnect,
}: {
  team: TeamKey; // offence/defence (unknown only if you allow custom)
  state: PanelState;
  onChange: (patch: Partial<PanelState>) => void;
  onDisconnect: () => void;
}) {
  const title =
    team === "offence"
      ? "Team: 5tar - Offence"
      : team === "defence"
      ? "Team: 5tar - Defence"
      : "Connected Camera";

  const color = team === "offence" ? "#b91c1c" : team === "defence" ? "#1d4ed8" : "#6b7280";

  const genToken = () => {
    const tok =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Date.now().toString(16);
    onChange({ token: tok });
  };

  return (
    <div
      style={{
        width: "100%",
        background: UI.cardBg,
        border: `1px solid ${UI.border}`,
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        padding: 20,
      }}
    >
      <Ribbon text={title} color={color} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={label}>Camera ID</div>
          <input
            style={inputStyle}
            value={state.cameraId}
            onChange={(e) => onChange({ cameraId: e.target.value })}
          />
        </div>
        <div>
          <div style={label}>Token</div>
          <input
            style={inputStyle}
            type="password"
            value={state.token}
            onChange={(e) => onChange({ token: e.target.value })}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: state.connected ? "#065f46" : "#374151",
            color: "#fff",
          }}
        >
          {state.connected ? "Socket Connected" : "Socket Disconnected"}
        </div>
        <div style={{ fontSize: 13, color: "#cbd5e1" }}>
          Total Detections: {state.detections}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={btnBase} onClick={() => onChange({ detections: 0 })}>
            ลบข้อมูล
          </button>
          <button style={btnBase} onClick={genToken}>
            GENERATE TOKEN
          </button>
          <button style={btnBase} onClick={onDisconnect}>
            DISCONNECT
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 16,
        }}
      >
        {/* Left column */}
        <div>
          <div
            style={{
              border: `1px solid ${UI.border}`,
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              background: "#0b1220",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ fontWeight: 700 }}>Filter by Date</div>
              <div>▾</div>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${UI.border}`,
              borderRadius: 14,
              padding: 14,
              background: "#0b1220",
              height: 280,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Detection Feed</div>
            <div
              style={{
                height: "calc(100% - 24px)",
                border: "1px dashed #334155",
                borderRadius: 10,
                color: "#94a3b8",
                display: "grid",
                placeItems: "center",
                fontSize: 14,
              }}
            >
              No detections found
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          style={{
            border: `1px solid ${UI.border}`,
            borderRadius: 14,
            padding: 14,
            background: "#0b1220",
            minHeight: 420,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Detection Map</div>
          <OSMEmbed />
        </div>
      </div>
    </div>
  );
}

/* ---------- Compact panel (initial) ---------- */
function CompactPanel({
  cameraId,
  token,
  onCameraChange,
  onTokenChange,
  onConnect,
}: {
  cameraId: string;
  token: string;
  onCameraChange: (v: string) => void;
  onTokenChange: (v: string) => void;
  onConnect: () => void;
}) {
  const canConnect = cameraId.trim() !== "" && token.trim() !== "";
  return (
    <div
      style={{
        width: "100%",
        background: UI.cardBg,
        border: `1px solid ${UI.border}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <div style={label}>Camera ID</div>
          <input
            style={inputStyle}
            value={cameraId}
            onChange={(e) => onCameraChange(e.target.value)}
            placeholder="Camera ID"
          />
        </div>
        <div>
          <div style={label}>Token</div>
          <input
            style={inputStyle}
            type="password"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            placeholder="Token"
          />
        </div>
        <button
          style={{ ...btnBase, height: 44, width: 130, opacity: canConnect ? 1 : 0.6 }}
          disabled={!canConnect}
          onClick={onConnect}
        >
          CONNECT
        </button>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  const router = useRouter();

  // auth guard (your original)
  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") router.replace("/");
  }, [router]);

  // Left side state
  const [leftExpanded, setLeftExpanded] = useState(false);
  const [leftTeam, setLeftTeam] = useState<TeamKey>("unknown");
  const [leftCam, setLeftCam] = useState("");
  const [leftTok, setLeftTok] = useState("");
  const [leftPanel, setLeftPanel] = useState<PanelState>({ ...emptyPanel });

  // Right side state
  const [rightExpanded, setRightExpanded] = useState(false);
  const [rightTeam, setRightTeam] = useState<TeamKey>("unknown");
  const [rightCam, setRightCam] = useState("");
  const [rightTok, setRightTok] = useState("");
  const [rightPanel, setRightPanel] = useState<PanelState>({ ...emptyPanel });

  // Decide team & default token (only when CONNECT is clicked)
  const resolveTeamAndToken = (cameraId: string, tokenInput: string): { team: TeamKey; token: string } => {
    if (cameraId === KNOWN.offence.id) {
      return { team: "offence", token: tokenInput || KNOWN.offence.token };
    }
    if (cameraId === KNOWN.defence.id) {
      return { team: "defence", token: tokenInput || KNOWN.defence.token };
    }
    return { team: "unknown", token: tokenInput };
  };

  // Connect buttons
  const onConnectLeft = () => {
    const cam = leftCam.trim();
    const tok = leftTok.trim();
    const { team, token } = resolveTeamAndToken(cam, tok);
    setLeftTeam(team);
    setLeftPanel({ cameraId: cam, token, connected: true, detections: 0 });
    setLeftExpanded(true);
    // keep right as-is; sides are not locked
    setLeftCam("");
    setLeftTok("");
  };
  const onConnectRight = () => {
    const cam = rightCam.trim();
    const tok = rightTok.trim();
    const { team, token } = resolveTeamAndToken(cam, tok);
    setRightTeam(team);
    setRightPanel({ cameraId: cam, token, connected: true, detections: 0 });
    setRightExpanded(true);
    setRightCam("");
    setRightTok("");
  };

  // Disconnect collapses the side
  const onDisconnectLeft = () => {
    setLeftExpanded(false);
    setLeftTeam("unknown");
    setLeftPanel({ ...emptyPanel });
    setLeftCam("");
    setLeftTok("");
  };
  const onDisconnectRight = () => {
    setRightExpanded(false);
    setRightTeam("unknown");
    setRightPanel({ ...emptyPanel });
    setRightCam("");
    setRightTok("");
  };

  return (
    <div style={{ minHeight: "100vh", background: UI.outerBg, color: UI.text, padding: 18 }}>
      {/* Top bar */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto 16px auto",
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>Battle Field</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={btnBase} onClick={() => router.push("/menu")}>
            Back to Menu
          </button>
          <button
            style={btnBase}
            onClick={() => {
              localStorage.removeItem("loggedIn");
              router.replace("/");
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Two columns (side is not locked to a team) */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {/* LEFT SIDE */}
        {leftExpanded ? (
          <ExpandedPanel
            team={leftTeam}
            state={leftPanel}
            onChange={(patch) => setLeftPanel((s) => ({ ...s, ...patch }))}
            onDisconnect={onDisconnectLeft}
          />
        ) : (
          <CompactPanel
            cameraId={leftCam}
            token={leftTok}
            onCameraChange={setLeftCam}
            onTokenChange={setLeftTok}
            onConnect={onConnectLeft}
          />
        )}

        {/* RIGHT SIDE */}
        {rightExpanded ? (
          <ExpandedPanel
            team={rightTeam}
            state={rightPanel}
            onChange={(patch) => setRightPanel((s) => ({ ...s, ...patch }))}
            onDisconnect={onDisconnectRight}
          />
        ) : (
          <CompactPanel
            cameraId={rightCam}
            token={rightTok}
            onCameraChange={setRightCam}
            onTokenChange={setRightTok}
            onConnect={onConnectRight}
          />
        )}
      </div>
    </div>
  );
}
