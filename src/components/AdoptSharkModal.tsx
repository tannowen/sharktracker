"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Heart, Sparkles, ChevronRight, MapPin } from "lucide-react";
import type { Shark } from "@/data/sharks";
import { SHARK_STATUS_CONFIG, getTimeSinceLastPing } from "@/data/sharks";

interface Props {
  onClose: () => void;
}

export default function AdoptSharkModal({ onClose }: Props) {
  const [sharks, setSharks]           = useState<Shark[]>([]);
  const [loading, setLoading]         = useState(true);
  const [query, setQuery]             = useState("");
  const [selected, setSelected]       = useState<Shark | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError]     = useState("");

  useEffect(() => {
    fetch("/api/sharks")
      .then((r) => r.json())
      .then((d: { sharks?: Shark[] }) => setSharks(d.sharks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sharks;
    return sharks.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.commonName.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
    );
  }, [sharks, query]);

  async function handleAdopt() {
    if (!selected) return;
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "adopt",
          sharkId: selected.id,
          sharkName: selected.name,
          sharkSpecies: selected.commonName,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error ?? "Something went wrong.");
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutError("Network error — please try again.");
      setCheckoutLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,8,16,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(10,17,40,0.98), rgba(5,13,26,0.98))",
          border: "1px solid rgba(0,229,255,0.18)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 48px rgba(0,229,255,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-pink-400" />
              <h2 className="text-base font-bold text-slate-100">Adopt a Shark</h2>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Choose a shark to sponsor for <span className="text-cyan-400 font-mono font-semibold">$2.99/month</span> — your contribution supports real tagging research.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {selected ? (
          /* ── Confirm screen ── */
          <div className="flex-1 flex flex-col p-5 gap-4">
            <button
              onClick={() => setSelected(null)}
              className="self-start text-[11px] font-mono text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
            >
              ← Back to list
            </button>

            {/* Shark card */}
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${selected.avatarColor}12, ${selected.avatarColor}06)`,
                border: `1px solid ${selected.avatarColor}35`,
                boxShadow: `0 0 24px ${selected.avatarColor}10`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-2xl"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${selected.avatarColor}25, ${selected.avatarColor}55)`,
                  border: `2px solid ${selected.avatarColor}60`,
                  boxShadow: `0 0 20px ${selected.avatarColor}30`,
                  color: selected.avatarColor,
                }}
              >
                {selected.avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 font-bold text-lg leading-tight">{selected.name}</p>
                <p className="text-slate-500 text-xs italic mb-2">{selected.commonName}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{selected.region}
                  </span>
                  <span>·</span>
                  <span className={SHARK_STATUS_CONFIG[selected.status].color}>
                    {SHARK_STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.12)" }}
            >
              <div>
                <p className="text-slate-300 text-sm font-semibold">Monthly sponsorship</p>
                <p className="text-[10px] text-slate-600 font-mono">Cancel anytime · billed monthly</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-mono font-bold text-lg">$2.99</p>
                <p className="text-[10px] text-slate-600 font-mono">per month</p>
              </div>
            </div>

            {checkoutError && (
              <p className="text-[11px] text-red-400 text-center px-2">{checkoutError}</p>
            )}

            <button
              onClick={handleAdopt}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: checkoutLoading
                  ? "rgba(0,229,255,0.15)"
                  : "linear-gradient(135deg, #00e5ff, #14f5d8, #4d9fff)",
                color: checkoutLoading ? "#00e5ff" : "#020810",
                boxShadow: checkoutLoading ? "none" : "0 4px 24px rgba(0,229,255,0.4)",
                border: checkoutLoading ? "1px solid rgba(0,229,255,0.3)" : "none",
              }}
            >
              {checkoutLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span>Redirecting to checkout…</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Sponsor {selected.name}</span>
                  <Sparkles className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* ── Shark picker ── */
          <>
            {/* Search */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, species, or region…"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs font-mono placeholder-slate-600 focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#cbd5e1",
                    caretColor: "#00e5ff",
                  }}
                  onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.3)"; }}
                  onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; }}
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-2">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl p-3 animate-pulse flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-white/5" />
                    <div className="h-2.5 w-32 rounded bg-white/5" />
                  </div>
                </div>
              ))}

              {!loading && visible.map((shark) => {
                const cfg = SHARK_STATUS_CONFIG[shark.status];
                return (
                  <button
                    key={shark.id}
                    onClick={() => setSelected(shark)}
                    className="w-full text-left rounded-xl p-3 transition-all duration-200 group flex items-center gap-3 hover:scale-[1.01]"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${shark.avatarColor}10, ${shark.avatarColor}05)`;
                      (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${shark.avatarColor}35`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
                      (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.05)";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${shark.avatarColor}20, ${shark.avatarColor}50)`,
                        border: `1.5px solid ${shark.avatarColor}60`,
                        color: shark.avatarColor,
                      }}
                    >
                      {shark.avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-100 font-semibold text-sm truncate">{shark.name}</p>
                      <p className="text-slate-500 text-[11px] italic truncate">{shark.commonName}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-2.5 h-2.5" />{shark.region}
                        </span>
                        <span className={cfg.color}>· {cfg.label}</span>
                        <span className="text-slate-700">· {getTimeSinceLastPing(shark.lastPing.timestamp)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                  </button>
                );
              })}

              {!loading && visible.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-600 text-xs">No sharks match "{query}"</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
