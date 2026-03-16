"use client";

import { Zap, Lock } from "lucide-react";

const PRO_LINK = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK ?? "https://buy.stripe.com/fZueVd8CyfNkgepdA89Ve01";

export default function UnlockProButton({ fullWidth = false }: { fullWidth?: boolean }) {
  function handleUnlock() {
    window.location.href = PRO_LINK;
  }

  return (
    <button
      onClick={handleUnlock}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]`}
      style={{
        background: "linear-gradient(135deg, #00e5ff 0%, #14f5d8 50%, #4d9fff 100%)",
        color: "#020810",
        boxShadow: "0 4px 24px rgba(0,229,255,0.4), 0 0 48px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", transform: "skewX(-15deg)" }}
      />
      <Zap className="w-4 h-4 relative z-10 flex-shrink-0" />
      <span className="relative z-10">Unlock Pro Tracker</span>
      <Lock className="w-3 h-3 relative z-10 opacity-60" />
    </button>
  );
}
