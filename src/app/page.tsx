"use client";

import { useState } from "react";
import { MOCK_SHARKS, type Shark } from "@/data/sharks";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DynamicMap from "@/components/DynamicMap";

// Simulate premium status — will be replaced with Clerk publicMetadata in production.
// Toggle this to `true` to preview the unlocked Historical Routes experience.
const IS_PREMIUM_PREVIEW = false;

export default function DashboardPage() {
  const [selectedShark, setSelectedShark] = useState<Shark | null>(null);

  function handleSharkSelect(shark: Shark) {
    setSelectedShark((prev) => (prev?.id === shark.id ? null : shark));
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-ocean-900">
      {/* Fullscreen map — base layer */}
      <div className="absolute inset-0 z-0">
        <DynamicMap
          sharks={MOCK_SHARKS}
          selectedShark={selectedShark}
          onSharkSelect={handleSharkSelect}
        />
      </div>

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,16,0.55) 100%)",
        }}
      />

      {/* Top edge fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(2,8,16,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Left sidebar — floats over the map */}
      <Sidebar
        sharks={MOCK_SHARKS}
        selectedShark={selectedShark}
        onSharkSelect={handleSharkSelect}
        isPremium={IS_PREMIUM_PREVIEW}
      />

      {/* Top-right bar — auth + CTA */}
      <TopBar />

      {/* Bottom status bar */}
      <BottomStatusBar selectedShark={selectedShark} />
    </main>
  );
}

function BottomStatusBar({ selectedShark }: { selectedShark: Shark | null }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div
        className="glass flex items-center gap-4 px-5 py-2.5 rounded-full"
        style={{ minWidth: "320px" }}
      >
        {selectedShark ? (
          <>
            <div
              className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
              style={{
                backgroundColor: selectedShark.avatarColor,
                boxShadow: `0 0 8px ${selectedShark.avatarColor}`,
              }}
            />
            <span className="text-xs font-mono text-slate-400">
              Tracking{" "}
              <span style={{ color: selectedShark.avatarColor }} className="font-semibold">
                {selectedShark.name}
              </span>
            </span>
            <span className="text-xs font-mono text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-600">
              {selectedShark.lastPing.lat.toFixed(2)}°,{" "}
              {selectedShark.lastPing.lng.toFixed(2)}°
            </span>
            <span className="text-xs font-mono text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-600">
              Depth: {selectedShark.lastPing.depth}m
            </span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-mono text-slate-500">
              {MOCK_SHARKS.filter((s) => s.status === "active").length} sharks active
            </span>
            <span className="text-xs font-mono text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-600">Select a shark to track</span>
          </>
        )}
      </div>
    </div>
  );
}
