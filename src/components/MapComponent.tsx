"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Shark } from "@/data/sharks";
import { getStatusGlowColor, getTimeSinceLastPing } from "@/data/sharks";

// Fix Leaflet's missing default icon issue in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPingIcon(color: string, isSelected: boolean, status: string): L.DivIcon {
  if (isSelected) {
    // Selected: larger dot + one slow pulse ring
    return L.divIcon({
      className: "",
      html: `
        <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
          <div style="
            position:absolute;
            width:40px;height:40px;
            border-radius:50%;
            background:${color};
            opacity:0;
            animation:ping-outer 2.5s cubic-bezier(0,0,0.2,1) infinite;
          "></div>
          <div style="
            width:16px;height:16px;
            border-radius:50%;
            background:${color};
            border:2.5px solid rgba(255,255,255,0.9);
            box-shadow:0 0 16px ${color}, 0 0 6px ${color};
            position:relative;z-index:1;
          "></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -28],
    });
  }

  // Unselected: static dot, no animation
  // Active sharks get a faint glow; resting/unknown get a dimmer dot
  const dim = status === "unknown" ? "0.45" : status === "resting" ? "0.65" : "1";
  const dotSize = 8;
  const wrap = 20;

  return L.divIcon({
    className: "",
    html: `
      <div style="width:${wrap}px;height:${wrap}px;display:flex;align-items:center;justify-content:center;">
        <div style="
          width:${dotSize}px;height:${dotSize}px;
          border-radius:50%;
          background:${color};
          opacity:${dim};
          box-shadow:0 0 6px ${color};
        "></div>
      </div>
    `,
    iconSize: [wrap, wrap],
    iconAnchor: [wrap / 2, wrap / 2],
    popupAnchor: [0, -(wrap / 2 + 4)],
  });
}

interface FlyToSharkProps {
  shark: Shark | null;
}

function FlyToShark({ shark }: FlyToSharkProps) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (shark && shark.id !== prevId.current) {
      prevId.current = shark.id;
      map.flyTo([shark.lastPing.lat, shark.lastPing.lng], 6, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [shark, map]);

  return null;
}

interface MapComponentProps {
  sharks: Shark[];
  selectedShark: Shark | null;
  onSharkSelect: (shark: Shark) => void;
}

export default function MapComponent({
  sharks,
  selectedShark,
  onSharkSelect,
}: MapComponentProps) {
  return (
    <MapContainer
      center={[10, -140]}
      zoom={3}
      minZoom={2}
      maxZoom={14}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      <FlyToShark shark={selectedShark} />

      {/* Custom zoom control position */}
      <ZoomControlPositioned />

      {sharks.map((shark) => {
        const color = getStatusGlowColor(shark.status);
        const isSelected = selectedShark?.id === shark.id;
        return (
          <Marker
            key={shark.id}
            position={[shark.lastPing.lat, shark.lastPing.lng]}
            icon={createPingIcon(color, isSelected, shark.status)}
            eventHandlers={{ click: () => onSharkSelect(shark) }}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: "180px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 35%, ${color}33, ${color}88)`,
                      border: `2px solid ${color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: color,
                    }}
                  >
                    {shark.avatarInitial}
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: "700", fontSize: "15px", color: "#e2e8f0" }}
                    >
                      {shark.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {shark.commonName}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <div style={{ color: "#475569", fontSize: "10px" }}>LAST PING</div>
                    <div style={{ color: "#94a3b8", fontFamily: "monospace" }}>
                      {getTimeSinceLastPing(shark.lastPing.timestamp)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#475569", fontSize: "10px" }}>REGION</div>
                    <div style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "11px" }}>
                      {shark.region}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#475569", fontSize: "10px" }}>LENGTH</div>
                    <div style={{ color: "#94a3b8", fontFamily: "monospace" }}>
                      {shark.lengthM ? `${shark.lengthM}m` : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#475569", fontSize: "10px" }}>STAGE</div>
                    <div style={{ color: color, fontFamily: "monospace", fontSize: "11px" }}>
                      {shark.stageOfLife || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function ZoomControlPositioned() {
  const map = useMap();
  useEffect(() => {
    L.control.zoom({ position: "bottomleft" }).addTo(map);
  }, [map]);
  return null;
}
