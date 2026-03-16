"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Sparkles, Lock, History, Heart, Waves } from "lucide-react";

// ─── Clerk UserButton appearance ──────────────────────────────────────────────
const userButtonAppearance = {
  elements: {
    avatarBox: {
      width: "34px",
      height: "34px",
      border: "1.5px solid rgba(0,229,255,0.35)",
      boxShadow: "0 0 12px rgba(0,229,255,0.2)",
    },
    userButtonPopoverCard: {
      background: "rgba(10, 17, 40, 0.95)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(0,229,255,0.12)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
    },
    userButtonPopoverActionButton: {
      color: "#94a3b8",
    },
    userButtonPopoverActionButtonText: { color: "inherit" },
    userButtonPopoverFooter: { display: "none" },
  },
};

// ─── Auth zone ────────────────────────────────────────────────────────────────
function AuthZone() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div className="w-20 h-7 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />;
  }

  if (isSignedIn) {
    const name = user?.firstName ?? "Diver";
    return (
      <>
        {/* Greeting — hidden on very small screens */}
        <span className="hidden sm:flex text-xs font-mono items-center gap-1.5">
          <Waves className="w-3 h-3 text-cyan-400/70" />
          <span className="text-slate-500">Welcome,</span>
          <span
            className="font-semibold"
            style={{ background: "linear-gradient(90deg, #00e5ff, #14f5d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {name}
          </span>
        </span>
        <div className="hidden sm:block w-px h-4 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <UserButton appearance={userButtonAppearance} />
      </>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", boxShadow: "0 0 20px rgba(0,229,255,0.1)" }}
        onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,229,255,0.18)"; b.style.boxShadow = "0 0 28px rgba(0,229,255,0.25)"; }}
        onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,229,255,0.1)"; b.style.boxShadow = "0 0 20px rgba(0,229,255,0.1)"; }}
      >
        {/* Login icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        <span className="hidden sm:inline">Dive In</span>
      </button>
    </SignInButton>
  );
}

// ─── Premium CTA ──────────────────────────────────────────────────────────────
function PremiumCTA() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else console.error("Checkout error:", data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Historical Data — hidden on mobile */}
      <button
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
      >
        <History className="w-4 h-4 text-slate-600" />
        <span>Historical Data</span>
        <Lock className="w-3 h-3 text-slate-700" />
      </button>

      {/* Adopt a Shark — icon-only on mobile, full label on sm+ */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{
          background: loading ? "rgba(0,229,255,0.2)" : "linear-gradient(135deg, #00e5ff, #14f5d8, #4d9fff)",
          color: loading ? "#00e5ff" : "#020810",
          boxShadow: loading ? "none" : "0 4px 20px rgba(0,229,255,0.35), 0 0 40px rgba(0,229,255,0.1)",
          border: loading ? "1px solid rgba(0,229,255,0.3)" : "none",
        }}
      >
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        ) : (
          <>
            <Heart className="w-4 h-4 relative z-10" />
            <span className="hidden sm:inline relative z-10">Adopt a Shark</span>
            <Sparkles className="hidden sm:inline w-3.5 h-3.5 relative z-10 opacity-70" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function TopBar() {
  return (
    <header className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 sm:gap-3">
      <PremiumCTA />
      <div className="w-px h-6 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="glass rounded-xl px-2 sm:px-3 py-2 flex items-center gap-2 sm:gap-3">
        <AuthZone />
      </div>
    </header>
  );
}
