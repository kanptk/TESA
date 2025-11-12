"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

interface DroneMapProps {
  /** Complete path from first point to most recent */
  path: LatLng[];
  /** Initial center if path is empty */
  initialCenter?: LatLng;
  /** Height of the map container */
  height?: string | number;
  /** When true, the map will pan to the newest point as it arrives */
  followLatest?: boolean;
}

function PanToLatest({ path, followLatest = true }: { path: LatLng[]; followLatest?: boolean }) {
  const map = useMap();
  const prevLen = useRef(0);

  useEffect(() => {
    if (!followLatest || path.length === 0) return;

    // On first points, fit the bounds. After that, pan to last.
    if (prevLen.current === 0 && path.length >= 2) {
      const lats = path.map(p => p.lat);
      const lngs = path.map(p => p.lng);
      const southWest: [number, number] = [Math.min(...lats), Math.min(...lngs)];
      const northEast: [number, number] = [Math.max(...lats), Math.max(...lngs)];
      map.fitBounds([southWest, northEast], { padding: [24, 24] });
    } else {
      const last = path[path.length - 1];
      map.panTo([last.lat, last.lng], { animate: true });
    }
    prevLen.current = path.length;
  }, [path, followLatest, map]);

  return null;
}

export default function DroneMap({
  path,
  // ✅ your requested default start center
  initialCenter = { lat: 14.297567, lng: 101.166279 },
  height = 480,
  followLatest = true,
}: DroneMapProps) {
  const start = path[0];
  const last = path[path.length - 1];

  const polylinePositions = useMemo(
    () => path.map(p => [p.lat, p.lng]) as [number, number][],
    [path]
  );

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer
        style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
        center={[start?.lat ?? initialCenter.lat, start?.lng ?? initialCenter.lng]}
        zoom={15}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Full path */}
        {polylinePositions.length >= 2 && (
          <Polyline positions={polylinePositions} weight={4} />
        )}

        {/* Start point (green) */}
        {start && (
          <CircleMarker center={[start.lat, start.lng]} radius={6} pathOptions={{ color: "green" }} />
        )}

        {/* Current/last point (red) */}
        {last && (
          <CircleMarker center={[last.lat, last.lng]} radius={7} pathOptions={{ color: "red" }} />
        )}

        <PanToLatest path={path} followLatest={followLatest} />
      </MapContainer>
    </div>
  );
}
