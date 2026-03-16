"use client";

import { useState, useMemo } from "react";
import {
  Radio, Wifi, ChevronRight, Fish, Ruler, Weight, Clock,
  MapPin, Tag, History, Lock, Route, Calendar, Navigation,
  X, Search, AlertTriangle,
} from "lucide-react";
import type { Shark, SharkStatus } from "@/data/sharks";
import { SHARK_STATUS_CONFIG, getTimeSinceLastPing } from "@/data/sharks";
import UnlockProButton from "./UnlockProButton";

// ─── Mock migration route data (premium feature placeholder) ─────────────────
const MOCK_ROUTES = [
  { id: "r1", name: "Pacific Ring Migration",  sharkName: "Lyra",   year: 2025, distanceKm: 4820, durationDays: 127, color: "#00e5ff" },
  { id: "r2", name: "Trans-Atlantic Crossing",  sharkName: "Spectra", year: 2024, distanceKm: 6140, durationDays: 198, color: "#64748b" },
  { id: "r3", name: "Southern Ocean Circuit",   sharkName: "Titan",   year: 2025, distanceKm: 3250, durationDays: 89,  color: "#6366f1" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  sharks: Shark[];
  allSharksCount?: number;
  loading?: boolean;
  error?: string | null;
  selectedShark: Shark | null;
  onSharkSelect: (shark: Shark) => void;
  isPremium?: boolean;
  activeOnly?: boolean;
  onActiveOnlyChange?: (v: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── StatusDot ────────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: SharkStatus }) {
  const cfg = SHARK_STATUS_CONFIG[status];
  return (
    <span className="relative inline-flex items-center justify-center w-4 h-4">
      {status !== "unknown" && (
        <span className={`absolute inline-flex w-3 h-3 rounded-full ${cfg.dot} opacity-40 animate-ping`} style={{ animationDuration: "2s" }} />
      )}
      <span className={`relative inline-flex w-2 h-2 rounded-full ${cfg.dot}`} />
    </span>
  );
}

// ─── SharkCard ────────────────────────────────────────────────────────────────
function SharkCard({
  shark, isSelected, onClick,
}: { shark: Shark; isSelected: boolean; onClick: () => void }) {
  const cfg = SHARK_STATUS_CONFIG[shark.status];
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-3 transition-all duration-300 group relative overflow-hidden"
      style={{
        background: isSelected ? `linear-gradient(135deg, ${shark.avatarColor}10, ${shark.avatarColor}05)` : "rgba(255,255,255,0.02)",
        border: `1px solid ${isSelected ? shark.avatarColor + "40" : "rgba(255,255,255,0.05)"}`,
        boxShadow: isSelected ? `0 0 20px ${shark.avatarColor}15, inset 0 1px 0 ${shark.avatarColor}10` : "none",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${shark.avatarColor}08, transparent)` }}
      />
      <div className="flex items-center gap-3 relative z-10">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${shark.avatarColor}20, ${shark.avatarColor}50)`,
            border: `1.5px solid ${shark.avatarColor}60`,
            boxShadow: `0 0 12px ${shark.avatarColor}30`,
            color: shark.avatarColor,
          }}
        >
          {shark.avatarInitial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-slate-100 font-semibold text-sm truncate">{shark.name}</span>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <StatusDot status={shark.status} />
              <span className={`text-[10px] font-mono ${cfg.color}`}>{cfg.label}</span>
            </div>
          </div>
          <div className="text-slate-500 text-[11px] italic truncate mb-1.5">{shark.commonName}</div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-2.5 h-2.5" />{shark.region}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-2.5 h-2.5" />{getTimeSinceLastPing(shark.lastPing.timestamp)}
            </span>
          </div>
        </div>

        <ChevronRight
          className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-200 ${
            isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0"
          }`}
          style={{ color: shark.avatarColor }}
        />
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 grid grid-cols-3 gap-2 border-t" style={{ borderColor: `${shark.avatarColor}20` }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Ruler className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Length</span>
            </div>
            <span className="text-xs font-mono" style={{ color: shark.avatarColor }}>
              {shark.lengthM ? `${shark.lengthM}m` : "—"}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Weight className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Mass</span>
            </div>
            <span className="text-xs font-mono" style={{ color: shark.avatarColor }}>
              {shark.weightKg ? `${shark.weightKg}kg` : "—"}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Tag className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-[9px] uppercase tracking-wider text-slate-600">Stage</span>
            </div>
            <span className="text-xs font-mono truncate" style={{ color: shark.avatarColor }}>
              {shark.stageOfLife.split(" ")[0]}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function SharkCardSkeleton() {
  return (
    <div className="rounded-xl p-3 animate-pulse" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="h-2.5 w-32 rounded bg-white/5" />
          <div className="h-2 w-20 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

// ─── Historical Routes section ────────────────────────────────────────────────
function RouteCard({ route }: { route: (typeof MOCK_ROUTES)[number] }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${route.color}15`, border: `1px solid ${route.color}30` }}>
          <Route className="w-3.5 h-3.5" style={{ color: route.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-300 text-xs font-semibold truncate">{route.name}</p>
          <p className="text-slate-600 text-[10px] italic mb-2">{route.sharkName}</p>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
            <span className="flex items-center gap-1"><Navigation className="w-2.5 h-2.5" />{route.distanceKm.toLocaleString()} km</span>
            <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{route.durationDays}d · {route.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoricalRoutesSection({ isPremium }: { isPremium: boolean }) {
  return (
    <div className="mt-1">
      <div className="px-4 mb-2 flex items-center gap-2">
        <History className="w-3 h-3 text-indigo-400" />
        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono flex-1">Migration Routes</span>
        {!isPremium && (
          <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-md" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}>Pro</span>
        )}
      </div>
      <div className="px-3 relative">
        <div className={`space-y-2 transition-all duration-300 ${!isPremium ? "blur-[3px] opacity-50 pointer-events-none select-none" : ""}`}>
          {MOCK_ROUTES.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
        {!isPremium && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl px-4" style={{ background: "linear-gradient(to bottom, rgba(5,13,26,0.15), rgba(5,13,26,0.75), rgba(5,13,26,0.15))" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(77,159,255,0.1))", border: "1px solid rgba(0,229,255,0.25)" }}>
              <Lock className="w-[18px] h-[18px] text-cyan-400" />
            </div>
            <p className="text-slate-200 text-xs font-bold mb-1 text-center">Premium Feature</p>
            <p className="text-slate-600 text-[10px] text-center mb-4 leading-relaxed">Visualise full migration paths with depth & time overlays</p>
            <UnlockProButton />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Core sidebar body ────────────────────────────────────────────────────────
function SidebarContent({
  sharks, allSharksCount, loading, error, selectedShark, onSharkSelect, isPremium,
  activeOnly, onActiveOnlyChange,
  isCollapsed, setIsCollapsed, isMobileDrawer = false, onClose,
}: {
  sharks: Shark[];
  allSharksCount?: number;
  loading?: boolean;
  error?: string | null;
  selectedShark: Shark | null;
  onSharkSelect: (s: Shark) => void;
  isPremium: boolean;
  activeOnly?: boolean;
  onActiveOnlyChange?: (v: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileDrawer?: boolean;
  onClose?: () => void;
}) {
  const [query, setQuery] = useState("");

  // Filter + sort
  const visibleSharks = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = sharks;
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.commonName.toLowerCase().includes(q) ||
          s.species.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sharks, query]);

  const activeCount  = sharks.filter((s) => s.status === "active").length;
  const restingCount = sharks.filter((s) => s.status === "resting").length;
  // Always show totals relative to the unfiltered dataset when possible
  const totalTagged = activeOnly ? (allSharksCount ?? sharks.length) : sharks.length;

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 p-4">
        <div className={`flex items-center gap-3 ${isCollapsed && !isMobileDrawer ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative" style={{ background: "linear-gradient(135deg, #00e5ff20, #00e5ff10)", border: "1px solid rgba(0,229,255,0.3)" }}>
            <Fish className="w-5 h-5" style={{ color: "#00e5ff" }} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDuration: "1.5s" }} />
          </div>

          {(!isCollapsed || isMobileDrawer) && (
            <>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold tracking-tight truncate" style={{ background: "linear-gradient(90deg, #00e5ff, #14f5d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ApexTracker
                </h1>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">Live Tracking</p>
              </div>
              {isMobileDrawer ? (
                <button onClick={onClose} className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => setIsCollapsed(true)} className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </>
          )}
        </div>

        {isCollapsed && !isMobileDrawer && (
          <button onClick={() => setIsCollapsed(false)} className="w-full mt-3 flex items-center justify-center h-8 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-white/5 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Expanded body ── */}
      {(!isCollapsed || isMobileDrawer) && (
        <>
          {/* Stats strip */}
          <div className="mx-4 mb-3 rounded-xl px-4 py-3 grid grid-cols-3 gap-2" style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.08)" }}>
            <div className="text-center">
              <div className={`text-lg font-bold font-mono text-cyan-400 leading-tight ${loading ? "animate-pulse" : ""}`}>
                {loading ? "—" : totalTagged}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-slate-600">Tagged</div>
            </div>
            <div className="text-center border-x border-white/5">
              <div className={`text-lg font-bold font-mono text-teal-400 leading-tight ${loading ? "animate-pulse" : ""}`}>
                {loading ? "—" : activeCount}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-slate-600">Active</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold font-mono text-indigo-400 leading-tight ${loading ? "animate-pulse" : ""}`}>
                {loading ? "—" : restingCount}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-slate-600">Resting</div>
            </div>
          </div>

          {/* Search input */}
          <div className="mx-4 mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sharks…"
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-mono placeholder-slate-600 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  caretColor: "#00e5ff",
                }}
                onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.3)"; }}
                onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pb-2">
            <div className="px-4 mb-2 flex items-center gap-2">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono flex-1">
                Tracked Individuals
              </span>
              {!loading && query && (
                <span className="text-[9px] font-mono text-slate-700 mr-1">
                  {visibleSharks.length}
                </span>
              )}
              {/* Active-only toggle */}
              <button
                onClick={() => onActiveOnlyChange?.(!activeOnly)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono transition-all duration-200"
                style={activeOnly ? {
                  background: "rgba(0,229,255,0.15)",
                  border: "1px solid rgba(0,229,255,0.35)",
                  color: "#00e5ff",
                } : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#475569",
                }}
                title={activeOnly ? `Showing ${sharks.length} active · click to show all` : `Showing all ${allSharksCount ?? sharks.length} · click to filter active`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: activeOnly ? "#00e5ff" : "#475569", boxShadow: activeOnly ? "0 0 4px #00e5ff" : "none" }}
                />
                {activeOnly ? "Active" : "All"}
              </button>
            </div>

            <div className="px-3 space-y-2 mb-4">
              {/* Error state */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl p-3 text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold mb-0.5">Failed to load</p>
                    <p className="text-red-600 text-[10px] font-mono leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {/* Skeleton */}
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <SharkCardSkeleton key={i} />
              ))}

              {/* Shark cards */}
              {!loading && !error && visibleSharks.map((shark) => (
                <SharkCard
                  key={shark.id}
                  shark={shark}
                  isSelected={selectedShark?.id === shark.id}
                  onClick={() => {
                    onSharkSelect(shark);
                    if (isMobileDrawer) onClose?.();
                  }}
                />
              ))}

              {/* Empty state */}
              {!loading && !error && visibleSharks.length === 0 && query && (
                <div className="text-center py-6">
                  <p className="text-slate-600 text-xs">No sharks match "{query}"</p>
                </div>
              )}
            </div>

            <div className="mx-4 mb-4 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <HistoricalRoutesSection isPremium={isPremium} />
            <div className="h-3" />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 mx-4 mb-4 mt-1 rounded-xl p-3 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <Wifi className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-teal-400">Live Feed</p>
              <p className="text-[9px] text-slate-600 truncate">Data via Mapotic · 15 min cache</p>
            </div>
            <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: loading ? "#64748b" : "#2dd4bf", boxShadow: loading ? "none" : "0 0 6px #2dd4bf" }} />
          </div>
        </>
      )}

      {/* ── Desktop collapsed icon rail ── */}
      {isCollapsed && !isMobileDrawer && (
        <div className="flex-1 flex flex-col items-center gap-3 px-2 pb-4 overflow-hidden">
          {sharks.slice(0, 12).map((shark) => (
            <button
              key={shark.id}
              onClick={() => { setIsCollapsed(false); onSharkSelect(shark); }}
              title={shark.name}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all hover:scale-110"
              style={{
                background: `radial-gradient(circle, ${shark.avatarColor}25, ${shark.avatarColor}10)`,
                border: `1.5px solid ${selectedShark?.id === shark.id ? shark.avatarColor : shark.avatarColor + "40"}`,
                color: shark.avatarColor,
                boxShadow: selectedShark?.id === shark.id ? `0 0 10px ${shark.avatarColor}50` : "none",
              }}
            >
              {shark.avatarInitial}
            </button>
          ))}
          <button onClick={() => setIsCollapsed(false)} title="Migration Routes"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#475569" }}
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Sidebar({
  sharks, allSharksCount, loading, error, selectedShark, onSharkSelect,
  isPremium = false, activeOnly = false, onActiveOnlyChange,
  mobileOpen = false, onMobileClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const shared = { sharks, allSharksCount, loading, error, selectedShark, onSharkSelect, isPremium, activeOnly, onActiveOnlyChange };

  return (
    <>
      {/* ════ DESKTOP (md+) ════ */}
      <aside
        className="hidden md:flex glass absolute left-4 top-4 bottom-4 z-20 flex-col rounded-2xl overflow-hidden transition-all duration-500"
        style={{ width: isCollapsed ? "60px" : "300px" }}
      >
        <SidebarContent {...shared} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </aside>

      {/* ════ MOBILE (<md) ════ */}
      <div
        className="md:hidden fixed inset-0 z-40 transition-all duration-500"
        style={{ background: "rgba(2,8,16,0.75)", backdropFilter: "blur(4px)", opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
        onClick={onMobileClose}
      />
      <aside
        className="md:hidden glass fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden transition-all duration-500"
        style={{ width: "min(85vw, 340px)", borderRadius: "0 20px 20px 0", transform: mobileOpen ? "translateX(0)" : "translateX(calc(-100% - 2px))" }}
      >
        <SidebarContent {...shared} isCollapsed={false} setIsCollapsed={() => {}} isMobileDrawer onClose={onMobileClose} />
      </aside>
    </>
  );
}
