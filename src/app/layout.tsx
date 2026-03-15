import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApexTracker — Live Shark Intelligence",
  description:
    "Real-time tracking of great white sharks and marine apex predators. Live pings, dive depth telemetry, and migration intelligence.",
  keywords: ["shark tracking", "marine life", "great white shark", "ocean telemetry"],
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#00e5ff",
    colorBackground: "#0a1128",
    colorInputBackground: "#0d1535",
    colorInputText: "#e2e8f0",
    colorText: "#e2e8f0",
    colorTextSecondary: "#64748b",
    colorNeutral: "#334155",
    colorDanger: "#f87171",
    borderRadius: "12px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontFamilyButtons: "Inter, system-ui, sans-serif",
    fontSize: "14px",
    spacingUnit: "16px",
  },
  elements: {
    card: {
      background: "rgba(10, 17, 40, 0.95)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(0,229,255,0.12)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
    },
    headerTitle: { color: "#e2e8f0", fontWeight: "700" },
    headerSubtitle: { color: "#64748b" },
    dividerLine: { background: "rgba(255,255,255,0.06)" },
    dividerText: { color: "#475569" },
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#94a3b8",
      "&:hover": {
        background: "rgba(255,255,255,0.07)",
      },
    },
    formFieldLabel: { color: "#94a3b8", fontSize: "12px", fontWeight: "500" },
    formFieldInput: {
      background: "#0d1535",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#e2e8f0",
      "&:focus": {
        border: "1px solid rgba(0,229,255,0.4)",
        boxShadow: "0 0 0 2px rgba(0,229,255,0.1)",
      },
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #00e5ff, #14f5d8)",
      color: "#020810",
      fontWeight: "600",
      "&:hover": {
        background: "linear-gradient(135deg, #14f5d8, #00e5ff)",
        boxShadow: "0 4px 20px rgba(0,229,255,0.35)",
      },
    },
    footerActionLink: { color: "#00e5ff" },
    identityPreviewText: { color: "#94a3b8" },
    identityPreviewEditButton: { color: "#00e5ff" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
