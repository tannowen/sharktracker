"use client";

import { useEffect, useState } from "react";
import {
  X, Tag, MapPin, Ruler, Weight, Lock, Clock, BookOpen,
  User, Layers, AlertCircle,
} from "lucide-react";
import type { Shark, SharkPing } from "@/data/sharks";
import {
  getTimeSinceLastPing,
  getStatusGlowColor,
  SHARK_STATUS_CONFIG,
} from "@/data/sharks";

interface SharkDetailPanelProps {
  shark: Shark | null;
  pings: SharkPing[];
  pingsLoading: boolean;
  onClose: () => void;
}

// ─── Ping row ─────────────────────────────────────────────────────────────────
function PingRow({ ping, isLatest, color }: { ping: SharkPing; isLatest: boolean; color: string }) {
  const latDir = ping.lat >= 0 ? "N" : "S";
  const lngDir = ping.lng >= 0 ? "E" : "W";
  const time = new Date(ping.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = new Date(ping.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-mono"
      style={{ background: isLatest ? `${color}0a` : "rgba(255,255,255,0.02)", border: `1px solid ${isLatest ? color + "25" : "rgba(255,255,255,0.04)"}` }}
    >
      <div className="flex-shrink-0 relative">
        {isLatest && <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: color, animationDuration: "2s" }} />}
        <div className="w-2 h-2 rounded-full relative z-10" style={{ backgroundColor: isLatest ? color : "#334155", boxShadow: isLatest ? `0 0 6px ${color}` : "none" }} />
      </div>
      <span className="text-slate-600 flex-shrink-0 w-10">{time}</span>
      <span className="text-slate-700 flex-shrink-0">{date}</span>
      <span className="text-slate-500 flex-1 truncate">
        {Math.abs(ping.lat).toFixed(2)}°{latDir}, {Math.abs(ping.lng).toFixed(2)}°{lngDir}
      </span>
    </div>
  );
}

// ─── Mini track map (lat/lng scatter) ────────────────────────────────────────
function TrackPreview({ pings, color }: { pings: SharkPing[]; color: string }) {
  if (pings.length < 2) return null;

  const lats = pings.map((p) => p.lat);
  const lngs = pings.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const rangeLat = maxLat - minLat || 1;
  const rangeLng = maxLng - minLng || 1;

  const toX = (lng: number) => ((lng - minLng) / rangeLng) * 220 + 10;
  const toY = (lat: number) => 60 - ((lat - minLat) / rangeLat) * 50 - 5;

  const pathD = pings
    .slice()
    .reverse()
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.lng).toFixed(1)},${toY(p.lat).toFixed(1)}`)
    .join(" ");

  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-slate-600 font-mono mb-2">Track Overview</div>
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.08)" }}>
        <svg viewBox="0 0 240 70" className="w-full h-16">
          <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          {pings.slice(0, 1).map((p, i) => (
            <circle key={i} cx={toX(p.lng)} cy={toY(p.lat)} r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          ))}
          {pings.slice(-1).map((p, i) => (
            <circle key={i} cx={toX(p.lng)} cy={toY(p.lat)} r="2" fill="#475569" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-1 text-[9px] font-mono text-slate-700">
        <span>{pings.length} pings</span>
        <span>
          {Math.abs(minLat).toFixed(1)}°{minLat >= 0 ? "N" : "S"} –{" "}
          {Math.abs(maxLat).toFixed(1)}°{maxLat >= 0 ? "N" : "S"}
        </span>
      </div>
    </div>
  );
}

// ─── Shared panel body ────────────────────────────────────────────────────────
function PanelBody({
  shark, pings, pingsLoading, onClose,
  showDragHandle = false, imageHeight = 192,
}: {
  shark: Shark;
  pings: SharkPing[];
  pingsLoading: boolean;
  onClose: () => void;
  showDragHandle?: boolean;
  imageHeight?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const color = shark.avatarColor;

  // Reset image state when shark changes
  const [lastId, setLastId] = useState(shark.id);
  if (shark.id !== lastId) {
    setImgError(false);
    setImgLoaded(false);
    setLastId(shark.id);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-[inherit]">

      {/* Drag handle — mobile only */}
      {showDragHandle && (
        <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>
      )}

      {/* Photo header */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ height: imageHeight }}>
        {!imgError && shark.imageUrl && (
          <img
            src={shark.imageUrl}
            alt={shark.name}
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        {/* Gradient fallback / overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 35% 40%, ${color}35, ${color}10, #020810)`, opacity: imgLoaded && !imgError ? 0 : 1 }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(2,8,16,0.25) 0%, transparent 35%, rgba(5,13,26,0.85) 80%, rgba(5,13,26,1) 100%)" }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <X className="w-4 h-4 text-slate-200" />
        </button>

        {/* Status badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono z-10"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${getStatusGlowColor(shark.status)}45`, color: getStatusGlowColor(shark.status) }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getStatusGlowColor(shark.status) }} />
          {SHARK_STATUS_CONFIG[shark.status].label.toUpperCase()}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-4 right-12">
          <h2 className="text-2xl font-bold tracking-tight leading-tight" style={{ color }}>{shark.name}</h2>
          <p className="text-slate-200 text-sm font-medium leading-tight">{shark.commonName}</p>
          <p className="text-slate-500 text-[10px] italic mt-0.5">{shark.species}</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-5">

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-slate-500 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span className="flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{shark.tagId}</span>
          <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" />{shark.sex === "F" ? "♀ Female" : shark.sex === "M" ? "♂ Male" : "Unknown sex"}</span>
          <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{shark.region}</span>
          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{getTimeSinceLastPing(shark.lastPing.timestamp)}</span>
        </div>

        {/* Stats grid 3×2 */}
        <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          {[
            { label: "Length",    value: shark.lengthM  ? `${shark.lengthM}m`                   : "—", Icon: Ruler    },
            { label: "Weight",    value: shark.weightKg ? `${shark.weightKg.toLocaleString()}kg` : "—", Icon: Weight   },
            { label: "Sex",       value: shark.sex === "F" ? "Female" : shark.sex === "M" ? "Male" : "Unknown", Icon: User  },
            { label: "Stage",     value: shark.stageOfLife || "—",                                   Icon: Layers   },
            { label: "Tagged At", value: shark.region || "—",                                         Icon: MapPin   },
            { label: "Species",   value: shark.commonName.split(" ").slice(-2).join(" "),             Icon: BookOpen },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center py-3.5 px-2" style={{ background: "rgba(5,13,26,0.7)" }}>
              <Icon className="w-3 h-3 mb-1 text-slate-700" />
              <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-0.5 text-center">{label}</div>
              <div className="text-xs font-mono font-bold text-center leading-tight truncate w-full text-center" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Last ping location */}
        <div className="rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ background: "rgba(0,229,255,0.04)", border: `1px solid ${color}18` }}>
          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color }} />
          <div>
            <div className="text-[9px] uppercase tracking-widest text-slate-600 font-mono mb-0.5">Last Known Position</div>
            <p className="text-xs font-mono" style={{ color }}>
              {Math.abs(shark.lastPing.lat).toFixed(4)}°{shark.lastPing.lat >= 0 ? "N" : "S"},{" "}
              {Math.abs(shark.lastPing.lng).toFixed(4)}°{shark.lastPing.lng >= 0 ? "E" : "W"}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {new Date(shark.lastPing.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Track overview */}
        {pingsLoading && (
          <div className="rounded-xl p-4 flex items-center justify-center gap-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: color, borderTopColor: "transparent" }} />
            <span className="text-[10px] font-mono text-slate-600">Loading ping history…</span>
          </div>
        )}

        {!pingsLoading && pings.length > 0 && <TrackPreview pings={pings} color={color} />}

        {/* Ping history */}
        {!pingsLoading && pings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] uppercase tracking-widest text-slate-600 font-mono">Ping History</span>
              <span className="text-[9px] font-mono text-slate-700">{pings.length} recorded</span>
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-0.5">
              {pings.map((ping, i) => <PingRow key={i} ping={ping} isLatest={i === 0} color={color} />)}
            </div>
          </div>
        )}

        {/* No pings yet */}
        {!pingsLoading && pings.length === 0 && (
          <div className="rounded-xl p-4 flex items-center gap-2 text-[11px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <AlertCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="text-slate-600 font-mono">No ping history available for this shark.</span>
          </div>
        )}

        {/* Migration CTA (locked) */}
        <div className="rounded-xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div>
            <p className="text-xs font-semibold text-slate-300">Full Migration History</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Route replay, timeline & heatmaps</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>PRO</span>
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
        </div>

        <div className="h-1" />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SharkDetailPanel({ shark, pings, pingsLoading, onClose }: SharkDetailPanelProps) {
  const isVisible = shark !== null;

  const [frozenShark, setFrozenShark] = useState<Shark | null>(null);
  const [frozenPings, setFrozenPings] = useState<SharkPing[]>([]);

  useEffect(() => {
    if (shark) {
      setFrozenShark(shark);
    }
  }, [shark]);

  useEffect(() => {
    if (pings.length > 0) setFrozenPings(pings);
    else if (!shark) setFrozenPings([]);
  }, [pings, shark]);

  const activeShark = shark ?? frozenShark;
  const activePings = isVisible ? pings : frozenPings;

  return (
    <>
      {/* ════ DESKTOP: right slide panel (md+) ════ */}
      <div
        className="hidden md:block absolute right-4 top-4 bottom-20 z-20 transition-all duration-500 ease-out"
        style={{ width: "360px", transform: isVisible ? "translateX(0)" : "translateX(calc(100% + 32px))", opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
      >
        <div className="glass h-full rounded-2xl overflow-hidden">
          {activeShark && <PanelBody shark={activeShark} pings={activePings} pingsLoading={pingsLoading} onClose={onClose} />}
        </div>
      </div>

      {/* ════ MOBILE: bottom sheet (<md) ════ */}
      <div
        className="md:hidden fixed inset-0 z-40 transition-all duration-500"
        style={{ background: "rgba(2,8,16,0.6)", backdropFilter: "blur(3px)", opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
        onClick={onClose}
      />
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
        style={{
          height: "82vh",
          borderRadius: "20px 20px 0 0",
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          pointerEvents: isVisible ? "auto" : "none",
          background: "rgba(10, 17, 40, 0.97)",
          backdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(0,229,255,0.10)",
          borderBottom: "none",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {activeShark && (
          <PanelBody shark={activeShark} pings={activePings} pingsLoading={pingsLoading} onClose={onClose} showDragHandle imageHeight={140} />
        )}
      </div>
    </>
  );
}
