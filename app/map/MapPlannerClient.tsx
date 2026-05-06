"use client";

import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ICON = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Waypoint = {
  id: string;
  lat: number;
  lng: number;
  name: string;
};

const SEOUL: [number, number] = [37.5665, 126.978];

function haversine(a: Waypoint, b: Waypoint): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function ClickHandler({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPlannerClient() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const polyline = useMemo(
    () => waypoints.map((w) => [w.lat, w.lng] as [number, number]),
    [waypoints],
  );

  const totalKm = useMemo(() => {
    let sum = 0;
    for (let i = 1; i < waypoints.length; i++) {
      sum += haversine(waypoints[i - 1], waypoints[i]);
    }
    return sum;
  }, [waypoints]);

  function addWaypoint(lat: number, lng: number) {
    setWaypoints((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        lat,
        lng,
        name: `경유지 ${prev.length + 1}`,
      },
    ]);
  }

  function removeWaypoint(id: string) {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
  }

  function move(id: string, delta: -1 | 1) {
    setWaypoints((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      const target = idx + delta;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function rename(id: string, name: string) {
    setWaypoints((prev) => prev.map((w) => (w.id === id ? { ...w, name } : w)));
  }

  function clear() {
    setWaypoints([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 shadow-sm">
        <MapContainer
          center={SEOUL}
          zoom={12}
          style={{ height: "480px", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onAdd={addWaypoint} />
          {waypoints.map((w, i) => (
            <Marker key={w.id} position={[w.lat, w.lng]} icon={ICON}>
              <Popup>
                <div className="text-sm font-medium">
                  {i + 1}. {w.name}
                </div>
                <div className="text-xs text-slate-500">
                  {w.lat.toFixed(4)}, {w.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          ))}
          {polyline.length >= 2 && (
            <Polyline positions={polyline} pathOptions={{ color: "#0f172a", weight: 4 }} />
          )}
        </MapContainer>
      </div>

      <aside className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/60 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">경유지</h2>
          <button
            onClick={clear}
            disabled={waypoints.length === 0}
            className="text-xs text-slate-500 underline disabled:opacity-40"
          >
            전체 삭제
          </button>
        </div>
        <p className="text-xs text-slate-600">
          총 {waypoints.length}개 · 직선거리 {totalKm.toFixed(1)} km
        </p>
        {waypoints.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-center text-xs text-slate-500">
            지도를 클릭해 경유지를 추가하세요.
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {waypoints.map((w, i) => (
              <li
                key={w.id}
                className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/80 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  <input
                    value={w.name}
                    onChange={(e) => rename(w.id, e.target.value)}
                    className="flex-1 rounded-md border border-transparent bg-transparent px-1 text-sm text-slate-900 focus:border-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {w.lat.toFixed(4)}, {w.lng.toFixed(4)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(w.id, -1)}
                      disabled={i === 0}
                      className="rounded-md border border-slate-200 px-2 py-0.5 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(w.id, 1)}
                      disabled={i === waypoints.length - 1}
                      className="rounded-md border border-slate-200 px-2 py-0.5 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeWaypoint(w.id)}
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
