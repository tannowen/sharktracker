"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { MOCK_SHARKS, type Shark } from "@/data/sharks";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DynamicMap from "@/components/DynamicMap";
import SharkDetailPanel from "@/components/SharkDetailPanel";

// Toggle to `true` to preview unlocked Historical Routes.
const IS_PREMIUM_PREVIEW = false;

export default function DashboardPage() {
  const [selectedShark, setSelectedShark] = useState<Shark | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleSharkSelect(shark: Shark) {
    setSelectedShark((prev) => (prev?.id === shark.id ? null : shark));
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-900">

      {/* ── Map base layer ── */}
      <div className="absolute inset-0 z-0">
        <DynamicMap
          sharks={MOCK_SHARKS}
          selectedShark={selectedShark}
          onSharkSelect={handleSharkSelect}
        />
      </div>

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,16,0.55) 100%)" }}
      />

      {/* ── Top edge fade ── */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(2,8,16,0.4) 0%, transparent 100%)" }}
      />

      {/* ── Mobile hamburger FAB — hidden on md+ (sidebar always visible there) ── */}
      <button
        className="md:hidden absolute top-3 left-3 z-30 glass w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open shark list"
      >
        <Menu className="w-5 h-5 text-slate-300" />
      </button>

      {/* ── Sidebar (desktop: left panel / mobile: slide drawer) ── */}
      <Sidebar
        sharks={MOCK_SHARKS}
        selectedShark={selectedShark}
        onSharkSelect={handleSharkSelect}
        isPremium={IS_PREMIUM_PREVIEW}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ── Shark detail panel (desktop: right panel / mobile: bottom sheet) ── */}
      <SharkDetailPanel
        shark={selectedShark}
        onClose={() => setSelectedShark(null)}
      />

      {/* ── Top-right auth + CTA ── */}
      <TopBar />

      {/* ── Bottom status bar ── */}
      <BottomStatusBar selectedShark={selectedShark} />
    </main>
  );
}

function BottomStatusBar({ selectedShark }: { selectedShark: Shark | null }) {
  const activeCount = MOCK_SHARKS.filter((s) => s.status === "active").length;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[calc(100%-2rem)] max-w-md">
      <div
        className="glass flex items-center gap-3 px-4 py-2.5 rounded-full"
      >
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
            <span className="text-xs font-mono text-slate-600 hidden sm:inline flex-shrink-0">
              · {selectedShark.lastPing.lat.toFixed(1)}°, {selectedShark.lastPing.lng.toFixed(1)}°
            </span>
            <span className="text-xs font-mono text-slate-600 flex-shrink-0 ml-auto">
              {selectedShark.lastPing.depth}m
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-mono text-slate-500">
              {activeCount}/{MOCK_SHARKS.length} active
            </span>
            <span className="text-xs font-mono text-slate-600 hidden sm:inline">·</span>
            <span className="text-xs font-mono text-slate-600 hidden sm:inline">
              Select a shark to track
            </span>
          </>
        )}
      </div>
    </div>
  );
}
