"use client";

import { useEffect, useState } from "react";
import {
  X,
  Tag,
  MapPin,
  Ruler,
  Weight,
  Zap,
  Calendar,
  Anchor,
  Lock,
  Clock,
  BookOpen,
} from "lucide-react";
import type { Shark } from "@/data/sharks";
import {
  getTimeSinceLastPing,
  getStatusGlowColor,
  SHARK_STATUS_CONFIG,
} from "@/data/sharks";

interface SharkDetailPanelProps {
  shark: Shark | null;
  onClose: () => void;
}

// ─── Depth gauge ──────────────────────────────────────────────────────────────
function DepthGauge({ depth, color }: { depth: number; color: string }) {
  const pct = Math.min((depth / 600) * 100, 96);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] uppercase tracking-widest text-slate-600 font-mono">Current Depth</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{depth}m</span>
      </div>
      <div className="relative h-3 rounded-full overflow-visible">
        <div className="h-full rounded-full" style={{ background: "linear-gradient(to right, #00e5ff 0%, #14f5d8 15%, #4d9fff 40%, #6366f1 70%, #1e1b4b 100%)" }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white transition-all duration-1000"
          style={{ left: `calc(${pct}% - 10px)`, backgroundColor: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-700">
        <span>0m</span><span>150m</span><span>300m</span><span>450m</span><span>600m+</span>
      </div>
    </div>
  );
}

// ─── Ping row ─────────────────────────────────────────────────────────────────
function PingRow({ ping, isLatest, color }: { ping: Shark["pings"][number]; isLatest: boolean; color: string }) {
  const latDir = ping.lat >= 0 ? "N" : "S";
  const lngDir = ping.lng >= 0 ? "E" : "W";
  const time = new Date(ping.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = new Date(ping.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
      <span className="text-slate-500 flex-1">{Math.abs(ping.lat).toFixed(1)}°{latDir}, {Math.abs(ping.lng).toFixed(1)}°{lngDir}</span>
      <span className="flex-shrink-0 flex items-center gap-1" style={{ color: isLatest ? color : "#475569" }}>
        <Anchor className="w-2.5 h-2.5" />{ping.depth}m
      </span>
    </div>
  );
}

// ─── Shared panel body ────────────────────────────────────────────────────────
// Used by both the desktop right-panel and mobile bottom-sheet
function PanelBody({
  shark,
  onClose,
  showDragHandle = false,
  imageHeight = 192,
}: {
  shark: Shark;
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
        {!imgError && (
          <img
            src={shark.imageUrl}
            alt={shark.commonName}
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
        {/* Gradient fallback */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 35% 40%, ${color}35, ${color}10, #020810)`, opacity: imgLoaded && !imgError ? 0 : 1 }}
        />
        {/* Bottom fade */}
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
          <span className="flex items-center gap-1">{shark.sex === "F" ? "♀ Female" : "♂ Male"}</span>
          <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{shark.region}</span>
          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{getTimeSinceLastPing(shark.lastPing.timestamp)}</span>
        </div>

        {/* Stats grid 3×2 */}
        <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          {[
            { label: "Length",    value: `${shark.lengthM}m`,                      Icon: Ruler    },
            { label: "Weight",    value: `${shark.weightKg.toLocaleString()}kg`,    Icon: Weight   },
            { label: "Depth Now", value: `${shark.lastPing.depth}m`,               Icon: Anchor   },
            { label: "Age Est.",  value: `~${shark.estimatedAgeYears} yr`,         Icon: Calendar },
            { label: "Top Speed", value: `${shark.topSpeedKmh} km/h`,              Icon: Zap      },
            { label: "Species",   value: shark.commonName.split(" ").slice(-2).join(" "), Icon: BookOpen },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center py-3.5 px-2" style={{ background: "rgba(5,13,26,0.7)" }}>
              <Icon className="w-3 h-3 mb-1 text-slate-700" />
              <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-0.5 text-center">{label}</div>
              <div className="text-xs font-mono font-bold text-center leading-tight" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Depth gauge */}
        <DepthGauge depth={shark.lastPing.depth} color={color} />

        {/* Ping history */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-mono">Ping History</span>
            <span className="text-[9px] font-mono text-slate-700">{shark.pings.length} recorded</span>
          </div>
          <div className="space-y-1.5">
            {shark.pings.map((ping, i) => <PingRow key={i} ping={ping} isLatest={i === 0} color={color} />)}
          </div>
        </div>

        {/* Field notes */}
        {shark.notes && (
          <div className="rounded-xl px-4 py-3.5" style={{ background: `${color}07`, border: `1px solid ${color}18` }}>
            <div className="text-[9px] uppercase tracking-widest text-slate-600 font-mono mb-2">Field Notes</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{shark.notes}</p>
          </div>
        )}

        {/* Migration CTA (locked) */}
        <div className="rounded-xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)" }}>
          <div>
            <p className="text-xs font-semibold text-slate-300">Full Migration History</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Route replay, depth timeline & heatmaps</p>
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
export default function SharkDetailPanel({ shark, onClose }: SharkDetailPanelProps) {
  const isVisible = shark !== null;

  // Freeze the last shark so the panel content doesn't disappear mid-animation
  const [frozenShark, setFrozenShark] = useState<Shark | null>(null);
  useEffect(() => {
    if (shark) setFrozenShark(shark);
  }, [shark]);

  const activeShark = shark ?? frozenShark;

  return (
    <>
      {/* ════ DESKTOP: right slide panel (md+) ════ */}
      <div
        className="hidden md:block absolute right-4 top-4 bottom-20 z-20 transition-all duration-500 ease-out"
        style={{
          width: "360px",
          transform: isVisible ? "translateX(0)" : "translateX(calc(100% + 32px))",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div className="glass h-full rounded-2xl overflow-hidden">
          {activeShark && <PanelBody shark={activeShark} onClose={onClose} />}
        </div>
      </div>

      {/* ════ MOBILE: bottom sheet (<md) ════ */}

      {/* Mobile backdrop */}
      <div
        className="md:hidden fixed inset-0 z-40 transition-all duration-500"
        style={{
          background: "rgba(2,8,16,0.6)",
          backdropFilter: "blur(3px)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
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
          <PanelBody
            shark={activeShark}
            onClose={onClose}
            showDragHandle
            imageHeight={140}
          />
        )}
      </div>
    </>
  );
}
