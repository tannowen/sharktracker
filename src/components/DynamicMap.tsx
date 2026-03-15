"use client";

import dynamic from "next/dynamic";
import type { Shark } from "@/data/sharks";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ocean-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/40 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-cyan-400/60" />
        </div>
        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">
          Initializing sonar...
        </p>
      </div>
    </div>
  ),
});

interface DynamicMapProps {
  sharks: Shark[];
  selectedShark: Shark | null;
  onSharkSelect: (shark: Shark) => void;
}

export default function DynamicMap(props: DynamicMapProps) {
  return <MapComponent {...props} />;
}
