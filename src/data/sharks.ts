export type SharkStatus = "active" | "resting" | "deep" | "unknown";

export interface SharkPing {
  lat: number;
  lng: number;
  depth: number;
  timestamp: string;
}

export interface Shark {
  id: string;
  name: string;
  species: string;      // scientific name, e.g. "Carcharodon carcharias"
  commonName: string;   // e.g. "White Shark"
  tagId: string;        // e.g. "OCE-288211"
  lengthM: number;      // metres, converted from ft/in
  weightKg: number;     // kg, converted from lbs
  sex: "M" | "F" | "U";
  stageOfLife: string;  // "Adult" | "Sub-Adult" | "Juvenile" | "Young of the Year"
  status: SharkStatus;
  lastPing: SharkPing;
  pings: SharkPing[];   // loaded lazily via /api/sharks/[id]/pings
  region: string;       // tag location, e.g. "Nantucket, MA"
  imageUrl: string;     // OCEARCH photo
  avatarColor: string;
  avatarInitial: string;
}

export const SHARK_STATUS_CONFIG: Record<
  SharkStatus,
  { label: string; color: string; dot: string }
> = {
  active:  { label: "Active",    color: "text-cyan-400",   dot: "bg-cyan-400"   },
  resting: { label: "Resting",   color: "text-teal-400",   dot: "bg-teal-400"   },
  deep:    { label: "Deep Dive", color: "text-indigo-400", dot: "bg-indigo-400" },
  unknown: { label: "No Signal", color: "text-slate-500",  dot: "bg-slate-500"  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTimeSinceLastPing(timestamp: string): string {
  const now  = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMin = Math.floor((now - then) / 60_000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo}mo ago`;
  return `${Math.floor(diffMo / 12)}y ago`;
}

export function getStatusGlowColor(status: SharkStatus): string {
  return (
    { active: "#00e5ff", resting: "#2dd4bf", deep: "#6366f1", unknown: "#475569" }[status]
  );
}
