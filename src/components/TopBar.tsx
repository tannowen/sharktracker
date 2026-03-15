"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Sparkles, Lock, History, Heart, Waves } from "lucide-react";

// ─── Clerk UserButton appearance override ────────────────────────────────────
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
      "&:hover": { background: "rgba(255,255,255,0.05)", color: "#e2e8f0" },
    },
    userButtonPopoverActionButtonText: { color: "inherit" },
    userButtonPopoverFooter: { display: "none" },
  },
};

// ─── Auth zone — client-side conditional rendering via useUser() ─────────────
// <Show> is a server component and cannot be used inside a "use client" file.
// useUser() provides isLoaded + isSignedIn for safe client-side branching.
function AuthZone() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Skeleton while Clerk hydrates
  if (!isLoaded) {
    return (
      <div className="w-24 h-7 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
    );
  }

  if (isSignedIn) {
    const name = user?.firstName ?? "Diver";
    return (
      <>
        <span className="text-xs font-mono flex items-center gap-1.5">
          <Waves className="w-3 h-3 text-cyan-400/70" />
          <span className="text-slate-500">Welcome back,</span>
          <span
            className="font-semibold"
            style={{
              background: "linear-gradient(90deg, #00e5ff, #14f5d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {name}
          </span>
        </span>
        <div className="w-px h-4 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <UserButton appearance={userButtonAppearance} />
      </>
    );
  }

  return <SignInTrigger />;
}

// ─── Sign-in trigger — custom-styled to match the oceanic theme ──────────────
function SignInTrigger() {
  return (
    <SignInButton mode="modal">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "rgba(0,229,255,0.1)",
          border: "1px solid rgba(0,229,255,0.3)",
          color: "#00e5ff",
          boxShadow: "0 0 20px rgba(0,229,255,0.1)",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "rgba(0,229,255,0.18)";
          btn.style.boxShadow = "0 0 28px rgba(0,229,255,0.25)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "rgba(0,229,255,0.1)";
          btn.style.boxShadow = "0 0 20px rgba(0,229,255,0.1)";
        }}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Dive In
      </button>
    </SignInButton>
  );
}

// ─── Premium CTA buttons ──────────────────────────────────────────────────────
function PremiumCTA() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Historical data — locked for free tier */}
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "#64748b",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.02)";
        }}
      >
        <History className="w-4 h-4 text-slate-600" />
        <span>Historical Data</span>
        <Lock className="w-3 h-3 text-slate-700" />
      </button>

      {/* Adopt a Shark — Stripe checkout entry point */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        style={{
          background: loading
            ? "rgba(0,229,255,0.2)"
            : "linear-gradient(135deg, #00e5ff, #14f5d8, #4d9fff)",
          color: loading ? "#00e5ff" : "#020810",
          boxShadow: loading
            ? "none"
            : "0 4px 20px rgba(0,229,255,0.35), 0 0 40px rgba(0,229,255,0.1)",
          border: loading ? "1px solid rgba(0,229,255,0.3)" : "none",
        }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Redirecting...</span>
          </>
        ) : (
          <>
            <Heart className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Adopt a Shark</span>
            <Sparkles className="w-3.5 h-3.5 relative z-10 opacity-70" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function TopBar() {
  return (
    <header className="absolute top-4 right-4 z-20 flex items-center gap-3">
      <PremiumCTA />

      <div
        className="w-px h-6 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />

      {/* Auth zone */}
      <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
        <AuthZone />
      </div>
    </header>
  );
}
