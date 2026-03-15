export type SharkStatus = "active" | "resting" | "deep" | "unknown";

export interface SharkPing {
  lat: number;
  lng: number;
  depth: number; // meters
  timestamp: string;
}

export interface Shark {
  id: string;
  name: string;
  species: string;
  commonName: string;
  tagId: string;
  lengthM: number;
  weightKg: number;
  sex: "M" | "F";
  status: SharkStatus;
  lastPing: SharkPing;
  pings: SharkPing[];
  region: string;
  adoptedBy?: string;
  avatarColor: string;
  avatarInitial: string;
}

export const SHARK_STATUS_CONFIG: Record<
  SharkStatus,
  { label: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  resting: {
    label: "Resting",
    color: "text-teal-400",
    dot: "bg-teal-400",
  },
  deep: {
    label: "Deep Dive",
    color: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  unknown: {
    label: "No Signal",
    color: "text-slate-500",
    dot: "bg-slate-500",
  },
};

export const MOCK_SHARKS: Shark[] = [
  {
    id: "shark-001",
    name: "Lyra",
    species: "Carcharodon carcharias",
    commonName: "Great White Shark",
    tagId: "GW-2847-A",
    lengthM: 5.2,
    weightKg: 1450,
    sex: "F",
    status: "active",
    region: "Central Pacific",
    avatarColor: "#00e5ff",
    avatarInitial: "L",
    lastPing: {
      lat: 24.5,
      lng: -142.8,
      depth: 12,
      timestamp: "2026-03-15T14:32:00Z",
    },
    pings: [
      { lat: 24.5, lng: -142.8, depth: 12, timestamp: "2026-03-15T14:32:00Z" },
      { lat: 24.1, lng: -143.2, depth: 8, timestamp: "2026-03-15T10:15:00Z" },
      { lat: 23.7, lng: -143.8, depth: 45, timestamp: "2026-03-15T06:00:00Z" },
    ],
  },
  {
    id: "shark-002",
    name: "Titan",
    species: "Carcharodon carcharias",
    commonName: "Great White Shark",
    tagId: "GW-1103-B",
    lengthM: 6.1,
    weightKg: 1980,
    sex: "M",
    status: "deep",
    region: "South Pacific",
    avatarColor: "#6366f1",
    avatarInitial: "T",
    lastPing: {
      lat: -18.3,
      lng: -130.5,
      depth: 380,
      timestamp: "2026-03-15T13:58:00Z",
    },
    pings: [
      {
        lat: -18.3,
        lng: -130.5,
        depth: 380,
        timestamp: "2026-03-15T13:58:00Z",
      },
      { lat: -18.0, lng: -130.1, depth: 22, timestamp: "2026-03-15T08:20:00Z" },
    ],
  },
  {
    id: "shark-003",
    name: "Nova",
    species: "Galeocerdo cuvier",
    commonName: "Tiger Shark",
    tagId: "TG-0554-C",
    lengthM: 4.3,
    weightKg: 635,
    sex: "F",
    status: "active",
    region: "Hawaiian Islands",
    avatarColor: "#14f5d8",
    avatarInitial: "N",
    lastPing: {
      lat: 20.8,
      lng: -156.3,
      depth: 6,
      timestamp: "2026-03-15T14:45:00Z",
    },
    pings: [
      {
        lat: 20.8,
        lng: -156.3,
        depth: 6,
        timestamp: "2026-03-15T14:45:00Z",
      },
      { lat: 20.5, lng: -156.6, depth: 18, timestamp: "2026-03-15T11:30:00Z" },
    ],
  },
  {
    id: "shark-004",
    name: "Orca",
    species: "Sphyrna mokarran",
    commonName: "Great Hammerhead",
    tagId: "HH-7821-D",
    lengthM: 3.8,
    weightKg: 450,
    sex: "M",
    status: "resting",
    region: "Florida Straits",
    avatarColor: "#2dd4bf",
    avatarInitial: "O",
    lastPing: {
      lat: 24.9,
      lng: -80.1,
      depth: 35,
      timestamp: "2026-03-15T12:10:00Z",
    },
    pings: [
      {
        lat: 24.9,
        lng: -80.1,
        depth: 35,
        timestamp: "2026-03-15T12:10:00Z",
      },
      { lat: 24.8, lng: -80.4, depth: 28, timestamp: "2026-03-15T09:45:00Z" },
    ],
  },
  {
    id: "shark-005",
    name: "Aegis",
    species: "Carcharodon carcharias",
    commonName: "Great White Shark",
    tagId: "GW-3392-E",
    lengthM: 4.7,
    weightKg: 1100,
    sex: "M",
    status: "active",
    region: "South Africa",
    avatarColor: "#4d9fff",
    avatarInitial: "A",
    lastPing: {
      lat: -34.1,
      lng: 26.8,
      depth: 9,
      timestamp: "2026-03-15T14:55:00Z",
    },
    pings: [
      {
        lat: -34.1,
        lng: 26.8,
        depth: 9,
        timestamp: "2026-03-15T14:55:00Z",
      },
      { lat: -34.3, lng: 26.5, depth: 65, timestamp: "2026-03-15T07:30:00Z" },
    ],
  },
  {
    id: "shark-006",
    name: "Spectra",
    species: "Isurus oxyrinchus",
    commonName: "Shortfin Mako",
    tagId: "MK-0091-F",
    lengthM: 3.1,
    weightKg: 280,
    sex: "F",
    status: "unknown",
    region: "North Atlantic",
    avatarColor: "#64748b",
    avatarInitial: "S",
    lastPing: {
      lat: 42.0,
      lng: -52.5,
      depth: 0,
      timestamp: "2026-03-14T22:18:00Z",
    },
    pings: [
      {
        lat: 42.0,
        lng: -52.5,
        depth: 0,
        timestamp: "2026-03-14T22:18:00Z",
      },
    ],
  },
];

export function getTimeSinceLastPing(timestamp: string): string {
  const now = new Date("2026-03-15T15:00:00Z");
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function getStatusGlowColor(status: SharkStatus): string {
  const map: Record<SharkStatus, string> = {
    active: "#00e5ff",
    resting: "#2dd4bf",
    deep: "#6366f1",
    unknown: "#475569",
  };
  return map[status];
}
