"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import type { Shark, SharkPing } from "@/data/sharks";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DynamicMap from "@/components/DynamicMap";
import SharkDetailPanel from "@/components/SharkDetailPanel";

export default function DashboardPage() {
  const { isSignedIn } = useUser();
  const [sharks, setSharks]               = useState<Shark[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [selectedShark, setSelectedShark] = useState<Shark | null>(null);
  const [selectedPings, setSelectedPings] = useState<SharkPing[]>([]);
  const [pingsLoading, setPingsLoading]   = useState(false);
  const [activeOnly, setActiveOnly]       = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPremium, setIsPremium]         = useState(false);

  const displayedSharks = activeOnly
    ? sharks.filter((s) => s.status === "active")
    : sharks;

  // Fetch all sharks on mount
  useEffect(() => {
    fetch("/api/sharks")
      .then((r) => r.json())
      .then((data: { sharks?: Shark[]; error?: string }) => {
        if (data.error) throw new Error(data.error);
        setSharks(data.sharks ?? []);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load sharks")
      )
      .finally(() => setLoading(false));
  }, []);

  // Check subscription status whenever auth state changes
  useEffect(() => {
    if (!isSignedIn) { setIsPremium(false); return; }
    fetch("/api/subscription-status")
      .then((r) => r.json())
      .then((d: { isPremium?: boolean }) => setIsPremium(d.isPremium ?? false))
      .catch(() => setIsPremium(false));
  }, [isSignedIn]);

  // Lazy-load pings when a shark is selected
  const loadPings = useCallback(async (shark: Shark) => {
    setPingsLoading(true);
    setSelectedPings([]);
    try {
      const r = await fetch(`/api/sharks/${shark.id}/pings`);
      const data = (await r.json()) as { pings?: SharkPing[]; error?: string };
      setSelectedPings(data.pings ?? []);
    } catch {
      // Pings failing is non-fatal — the panel still shows basic info
    } finally {
      setPingsLoading(false);
    }
  }, []);

  function handleSharkSelect(shark: Shark) {
    if (selectedShark?.id === shark.id) {
      setSelectedShark(null);
      setSelectedPings([]);
      return;
    }
    setSelectedShark(shark);
    void loadPings(shark);
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-900">

      {/* ── Map ── */}
      <div className="absolute inset-0 z-0">
        <DynamicMap
          sharks={displayedSharks}
          selectedShark={selectedShark}
          onSharkSelect={handleSharkSelect}
        />
      </div>

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,16,0.55) 100%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(2,8,16,0.4) 0%, transparent 100%)" }}
      />

      {/* ── Mobile hamburger FAB ── */}
      <button
        className="md:hidden absolute top-3 left-3 z-30 glass w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open shark list"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>

      {/* ── Sidebar ── */}
      <Sidebar
        sharks={displayedSharks}
        allSharksCount={sharks.length}
        loading={loading}
        error={error}
        selectedShark={selectedShark}
        onSharkSelect={handleSharkSelect}
        isPremium={isPremium}
        activeOnly={activeOnly}
        onActiveOnlyChange={setActiveOnly}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Detail panel ── */}
        <SharkDetailPanel
          shark={selectedShark}
          pings={selectedPings}
          pingsLoading={pingsLoading}
          isPremium={isPremium}
          onClose={() => { setSelectedShark(null); setSelectedPings([]); }}
        />

      {/* ── Top-right auth + CTA ── */}
      <TopBar />

      {/* ── Bottom status bar ── */}
      <BottomStatusBar selectedShark={selectedShark} displayed={displayedSharks.length} total={sharks.length} loading={loading} activeOnly={activeOnly} />
    </main>
  );
}

function BottomStatusBar({
  selectedShark, displayed, total, loading, activeOnly,
}: {
  selectedShark: Shark | null;
  displayed: number;
  total: number;
  loading: boolean;
  activeOnly: boolean;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[calc(100%-2rem)] max-w-md">
      <div className="glass flex items-center gap-3 px-4 py-2.5 rounded-full">
        {selectedShark ? (
          <>
            <div
              className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: selectedShark.avatarColor, boxShadow: `0 0 8px ${selectedShark.avatarColor}` }}
            />
            <span className="text-xs font-mono text-slate-400 truncate">
              Tracking{" "}
              <span style={{ color: selectedShark.avatarColor }} className="font-semibold">
                {selectedShark.name}
              </span>
              <span className="hidden sm:inline text-slate-600"> · {selectedShark.commonName}</span>
            </span>
            <span className="text-xs font-mono text-slate-600 flex-shrink-0 ml-auto">
              {selectedShark.lastPing.lat.toFixed(1)}°, {selectedShark.lastPing.lng.toFixed(1)}°
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
            {loading ? (
              <span className="text-xs font-mono text-slate-500">Loading live data…</span>
            ) : (
              <span className="text-xs font-mono text-slate-500">
                {activeOnly
                  ? `${displayed} active shark${displayed !== 1 ? "s" : ""} of ${total} total`
                  : `${total} sharks tracked · select one to focus`}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
