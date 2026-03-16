"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Zap, Lock } from "lucide-react";

// Pre-initialise Stripe.js so it's ready before the user clicks (non-blocking).
// The instance is used for future payment element integrations; current checkout
// flow redirects to Stripe-hosted checkout via the session URL.
void (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null));

export default function UnlockProButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUnlock() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pro" }),
      });
      const data = (await res.json()) as {
        url?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleUnlock}
        disabled={status === "loading"}
        className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group disabled:cursor-not-allowed`}
        style={{
          background:
            status === "loading"
              ? "rgba(0,229,255,0.1)"
              : "linear-gradient(135deg, #00e5ff 0%, #14f5d8 50%, #4d9fff 100%)",
          color: status === "loading" ? "#00e5ff" : "#020810",
          boxShadow:
            status === "loading"
              ? "none"
              : "0 4px 24px rgba(0,229,255,0.4), 0 0 48px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
          border: status === "loading" ? "1px solid rgba(0,229,255,0.25)" : "none",
        }}
      >
        {/* Shimmer on hover */}
        {status === "idle" && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              transform: "skewX(-15deg)",
            }}
          />
        )}

        {status === "loading" ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Connecting to Stripe…</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 relative z-10 flex-shrink-0" />
            <span className="relative z-10">Unlock Pro Tracker</span>
            <Lock className="w-3 h-3 relative z-10 opacity-60" />
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-[11px] text-red-400/80 text-center px-2 leading-relaxed">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
