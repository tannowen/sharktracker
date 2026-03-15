export type SharkStatus = "active" | "resting" | "deep" | "unknown";

export interface SharkPing {
  lat: number;
  lng: number;
  depth: number; // metres
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
  estimatedAgeYears: number;
  topSpeedKmh: number;
  status: SharkStatus;
  lastPing: SharkPing;
  pings: SharkPing[];
  region: string;
  imageUrl: string;
  notes: string;
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

export const MOCK_SHARKS: Shark[] = [
  // ─── Great White Sharks ───────────────────────────────────────────────────
  {
    id: "shark-001",
    name: "Lyra",
    species: "Carcharodon carcharias",
    commonName: "Great White Shark",
    tagId: "GW-2847-A",
    lengthM: 5.2,
    weightKg: 1450,
    sex: "F",
    estimatedAgeYears: 14,
    topSpeedKmh: 40,
    status: "active",
    region: "Central Pacific",
    avatarColor: "#00e5ff",
    avatarInitial: "L",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
    notes:
      "Tagged in 2021 off Guadalupe Island. Has completed two full Pacific crossings and holds the ApexTracker annual distance record at 4,820 km.",
    lastPing: { lat: 24.5, lng: -142.8, depth: 12, timestamp: "2026-03-15T14:32:00Z" },
    pings: [
      { lat: 24.5,  lng: -142.8, depth: 12,  timestamp: "2026-03-15T14:32:00Z" },
      { lat: 24.1,  lng: -143.2, depth: 8,   timestamp: "2026-03-15T10:15:00Z" },
      { lat: 23.7,  lng: -143.8, depth: 45,  timestamp: "2026-03-15T06:00:00Z" },
      { lat: 23.0,  lng: -144.5, depth: 110, timestamp: "2026-03-14T22:30:00Z" },
      { lat: 22.4,  lng: -145.1, depth: 18,  timestamp: "2026-03-14T17:00:00Z" },
      { lat: 21.8,  lng: -145.9, depth: 6,   timestamp: "2026-03-14T11:45:00Z" },
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
    estimatedAgeYears: 22,
    topSpeedKmh: 40,
    status: "deep",
    region: "South Pacific",
    avatarColor: "#6366f1",
    avatarInitial: "T",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
    notes:
      "One of the largest individuals in our database. Recently dove to 382 m near the Clarion–Clipperton zone — a new personal depth record.",
    lastPing: { lat: -18.3, lng: -130.5, depth: 380, timestamp: "2026-03-15T13:58:00Z" },
    pings: [
      { lat: -18.3, lng: -130.5, depth: 380, timestamp: "2026-03-15T13:58:00Z" },
      { lat: -18.0, lng: -130.1, depth: 22,  timestamp: "2026-03-15T08:20:00Z" },
      { lat: -17.6, lng: -129.8, depth: 190, timestamp: "2026-03-14T23:10:00Z" },
      { lat: -17.1, lng: -129.4, depth: 8,   timestamp: "2026-03-14T15:45:00Z" },
      { lat: -16.8, lng: -129.0, depth: 55,  timestamp: "2026-03-14T09:00:00Z" },
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
    estimatedAgeYears: 11,
    topSpeedKmh: 40,
    status: "active",
    region: "South Africa",
    avatarColor: "#4d9fff",
    avatarInitial: "A",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=800&q=80",
    notes:
      "Photographed by researchers at Gansbaai in 2024. A distinctive crescent-shaped scar on the dorsal fin is used for photo-ID across datasets.",
    lastPing: { lat: -34.1, lng: 26.8,  depth: 9,  timestamp: "2026-03-15T14:55:00Z" },
    pings: [
      { lat: -34.1, lng: 26.8,  depth: 9,   timestamp: "2026-03-15T14:55:00Z" },
      { lat: -34.3, lng: 26.5,  depth: 65,  timestamp: "2026-03-15T07:30:00Z" },
      { lat: -34.6, lng: 26.2,  depth: 14,  timestamp: "2026-03-15T01:00:00Z" },
      { lat: -34.9, lng: 25.8,  depth: 30,  timestamp: "2026-03-14T18:20:00Z" },
      { lat: -35.2, lng: 25.5,  depth: 5,   timestamp: "2026-03-14T11:00:00Z" },
    ],
  },

  // ─── Tiger Shark ─────────────────────────────────────────────────────────
  {
    id: "shark-003",
    name: "Nova",
    species: "Galeocerdo cuvier",
    commonName: "Tiger Shark",
    tagId: "TG-0554-C",
    lengthM: 4.3,
    weightKg: 635,
    sex: "F",
    estimatedAgeYears: 16,
    topSpeedKmh: 32,
    status: "active",
    region: "Hawaiian Islands",
    avatarColor: "#14f5d8",
    avatarInitial: "N",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72a8c31d4485?auto=format&fit=crop&w=800&q=80",
    notes:
      "Known to frequent recreational dive sites near Maui. Nova is listed in three separate university research programmes and is the most-studied shark in our database.",
    lastPing: { lat: 20.8, lng: -156.3, depth: 6,  timestamp: "2026-03-15T14:45:00Z" },
    pings: [
      { lat: 20.8, lng: -156.3, depth: 6,   timestamp: "2026-03-15T14:45:00Z" },
      { lat: 20.5, lng: -156.6, depth: 18,  timestamp: "2026-03-15T11:30:00Z" },
      { lat: 20.2, lng: -156.9, depth: 40,  timestamp: "2026-03-15T05:15:00Z" },
      { lat: 19.9, lng: -157.2, depth: 10,  timestamp: "2026-03-14T21:00:00Z" },
      { lat: 19.6, lng: -157.5, depth: 22,  timestamp: "2026-03-14T14:30:00Z" },
    ],
  },

  // ─── Great Hammerhead ────────────────────────────────────────────────────
  {
    id: "shark-004",
    name: "Orca",
    species: "Sphyrna mokarran",
    commonName: "Great Hammerhead",
    tagId: "HH-7821-D",
    lengthM: 3.8,
    weightKg: 450,
    sex: "M",
    estimatedAgeYears: 20,
    topSpeedKmh: 25,
    status: "resting",
    region: "Florida Straits",
    avatarColor: "#2dd4bf",
    avatarInitial: "O",
    imageUrl: "https://images.unsplash.com/photo-1583396618422-38b67a7a6a4e?auto=format&fit=crop&w=800&q=80",
    notes:
      "Discovered entangled in monofilament gear near the Dry Tortugas in 2022. Successfully freed and re-tagged by the ApexTracker field team.",
    lastPing: { lat: 24.9, lng: -80.1, depth: 35, timestamp: "2026-03-15T12:10:00Z" },
    pings: [
      { lat: 24.9, lng: -80.1, depth: 35, timestamp: "2026-03-15T12:10:00Z" },
      { lat: 24.8, lng: -80.4, depth: 28, timestamp: "2026-03-15T09:45:00Z" },
      { lat: 24.7, lng: -80.7, depth: 12, timestamp: "2026-03-15T04:30:00Z" },
      { lat: 24.5, lng: -81.0, depth: 50, timestamp: "2026-03-14T22:00:00Z" },
      { lat: 24.3, lng: -81.3, depth: 8,  timestamp: "2026-03-14T16:15:00Z" },
    ],
  },

  // ─── Shortfin Mako ───────────────────────────────────────────────────────
  {
    id: "shark-006",
    name: "Spectra",
    species: "Isurus oxyrinchus",
    commonName: "Shortfin Mako",
    tagId: "MK-0091-F",
    lengthM: 3.1,
    weightKg: 280,
    sex: "F",
    estimatedAgeYears: 9,
    topSpeedKmh: 74,
    status: "unknown",
    region: "North Atlantic",
    avatarColor: "#64748b",
    avatarInitial: "S",
    imageUrl: "https://images.unsplash.com/photo-1547025688-afc91427e3be?auto=format&fit=crop&w=800&q=80",
    notes:
      "Signal lost for 16 consecutive days in February. Likely undertook a rapid open-ocean sprint — Makos are the fastest sharks on Earth at 74 km/h.",
    lastPing: { lat: 42.0, lng: -52.5, depth: 0, timestamp: "2026-03-14T22:18:00Z" },
    pings: [
      { lat: 42.0, lng: -52.5, depth: 0,  timestamp: "2026-03-14T22:18:00Z" },
      { lat: 41.2, lng: -53.8, depth: 12, timestamp: "2026-03-13T14:00:00Z" },
      { lat: 40.5, lng: -55.2, depth: 5,  timestamp: "2026-03-12T08:30:00Z" },
    ],
  },

  // ─── Bull Shark ──────────────────────────────────────────────────────────
  {
    id: "shark-007",
    name: "Phantom",
    species: "Carcharhinus leucas",
    commonName: "Bull Shark",
    tagId: "BS-4471-G",
    lengthM: 3.2,
    weightKg: 290,
    sex: "M",
    estimatedAgeYears: 13,
    topSpeedKmh: 40,
    status: "active",
    region: "Gulf of Mexico",
    avatarColor: "#ef4444",
    avatarInitial: "P",
    imageUrl: "https://images.unsplash.com/photo-1580019542155-247062e19ce4?auto=format&fit=crop&w=800&q=80",
    notes:
      "Primarily hunts the oil-rig ecosystems in the northern Gulf. Bull sharks are the only species capable of surviving indefinitely in both fresh and salt water.",
    lastPing: { lat: 25.4, lng: -90.2, depth: 8, timestamp: "2026-03-15T15:01:00Z" },
    pings: [
      { lat: 25.4, lng: -90.2, depth: 8,  timestamp: "2026-03-15T15:01:00Z" },
      { lat: 25.1, lng: -90.8, depth: 22, timestamp: "2026-03-15T11:00:00Z" },
      { lat: 24.8, lng: -91.4, depth: 5,  timestamp: "2026-03-15T06:30:00Z" },
      { lat: 24.5, lng: -91.9, depth: 35, timestamp: "2026-03-14T23:45:00Z" },
      { lat: 24.2, lng: -92.3, depth: 14, timestamp: "2026-03-14T17:00:00Z" },
    ],
  },

  // ─── Blue Shark ──────────────────────────────────────────────────────────
  {
    id: "shark-008",
    name: "Celeste",
    species: "Prionace glauca",
    commonName: "Blue Shark",
    tagId: "BL-0228-H",
    lengthM: 3.5,
    weightKg: 204,
    sex: "F",
    estimatedAgeYears: 8,
    topSpeedKmh: 39,
    status: "active",
    region: "North Pacific",
    avatarColor: "#60a5fa",
    avatarInitial: "C",
    imageUrl: "https://images.unsplash.com/photo-1511715112108-9acc32ec5a3e?auto=format&fit=crop&w=800&q=80",
    notes:
      "Blue sharks regularly migrate 9,000+ km across ocean basins. Celeste was first tagged in the Azores and tracked all the way to California.",
    lastPing: { lat: 38.2, lng: -155.4, depth: 180, timestamp: "2026-03-15T13:20:00Z" },
    pings: [
      { lat: 38.2, lng: -155.4, depth: 180, timestamp: "2026-03-15T13:20:00Z" },
      { lat: 37.8, lng: -154.9, depth: 55,  timestamp: "2026-03-15T08:00:00Z" },
      { lat: 37.4, lng: -154.3, depth: 210, timestamp: "2026-03-15T01:30:00Z" },
      { lat: 36.9, lng: -153.8, depth: 90,  timestamp: "2026-03-14T19:00:00Z" },
      { lat: 36.4, lng: -153.2, depth: 15,  timestamp: "2026-03-14T12:45:00Z" },
    ],
  },

  // ─── Whale Shark ─────────────────────────────────────────────────────────
  {
    id: "shark-009",
    name: "Goliath",
    species: "Rhincodon typus",
    commonName: "Whale Shark",
    tagId: "WS-7734-I",
    lengthM: 11.2,
    weightKg: 18500,
    sex: "M",
    estimatedAgeYears: 42,
    topSpeedKmh: 5,
    status: "resting",
    region: "Indian Ocean",
    avatarColor: "#a78bfa",
    avatarInitial: "G",
    imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80",
    notes:
      "The world's largest fish. A filter feeder and completely harmless to humans. Goliath's tag is attached near the first dorsal fin using a titanium dart.",
    lastPing: { lat: -4.8, lng: 72.3, depth: 22, timestamp: "2026-03-15T11:05:00Z" },
    pings: [
      { lat: -4.8,  lng: 72.3,  depth: 22, timestamp: "2026-03-15T11:05:00Z" },
      { lat: -5.1,  lng: 72.0,  depth: 35, timestamp: "2026-03-15T06:00:00Z" },
      { lat: -5.4,  lng: 71.7,  depth: 18, timestamp: "2026-03-14T22:30:00Z" },
      { lat: -5.7,  lng: 71.4,  depth: 50, timestamp: "2026-03-14T15:00:00Z" },
      { lat: -6.0,  lng: 71.1,  depth: 10, timestamp: "2026-03-14T09:00:00Z" },
    ],
  },

  // ─── Blacktip Reef Shark ─────────────────────────────────────────────────
  {
    id: "shark-010",
    name: "Reef",
    species: "Carcharhinus melanopterus",
    commonName: "Blacktip Reef Shark",
    tagId: "BR-1192-J",
    lengthM: 1.8,
    weightKg: 14,
    sex: "M",
    estimatedAgeYears: 6,
    topSpeedKmh: 30,
    status: "active",
    region: "Maldives",
    avatarColor: "#34d399",
    avatarInitial: "R",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    notes:
      "This individual has occupied the same reef system for 4 consecutive years, demonstrating strong site fidelity. Popular with local dive operators.",
    lastPing: { lat: 4.2, lng: 73.5, depth: 3, timestamp: "2026-03-15T14:58:00Z" },
    pings: [
      { lat: 4.2,  lng: 73.5,  depth: 3,  timestamp: "2026-03-15T14:58:00Z" },
      { lat: 4.1,  lng: 73.4,  depth: 8,  timestamp: "2026-03-15T10:30:00Z" },
      { lat: 4.0,  lng: 73.3,  depth: 2,  timestamp: "2026-03-15T04:00:00Z" },
      { lat: 3.9,  lng: 73.2,  depth: 12, timestamp: "2026-03-14T20:15:00Z" },
      { lat: 3.8,  lng: 73.1,  depth: 5,  timestamp: "2026-03-14T14:00:00Z" },
    ],
  },

  // ─── Oceanic Whitetip ────────────────────────────────────────────────────
  {
    id: "shark-011",
    name: "Indigo",
    species: "Carcharhinus longimanus",
    commonName: "Oceanic Whitetip",
    tagId: "OW-3356-K",
    lengthM: 3.1,
    weightKg: 168,
    sex: "F",
    estimatedAgeYears: 18,
    topSpeedKmh: 20,
    status: "active",
    region: "Red Sea",
    avatarColor: "#818cf8",
    avatarInitial: "I",
    imageUrl: "https://images.unsplash.com/photo-1562329265-95a6d7a83440?auto=format&fit=crop&w=800&q=80",
    notes:
      "Oceanic Whitetips were once among the most abundant pelagic sharks. Now Critically Endangered — every tagged individual represents vital population data.",
    lastPing: { lat: 22.1, lng: 37.4, depth: 45, timestamp: "2026-03-15T14:22:00Z" },
    pings: [
      { lat: 22.1, lng: 37.4, depth: 45,  timestamp: "2026-03-15T14:22:00Z" },
      { lat: 21.8, lng: 37.1, depth: 80,  timestamp: "2026-03-15T09:00:00Z" },
      { lat: 21.5, lng: 36.8, depth: 20,  timestamp: "2026-03-15T03:30:00Z" },
      { lat: 21.2, lng: 36.5, depth: 110, timestamp: "2026-03-14T21:00:00Z" },
      { lat: 20.9, lng: 36.2, depth: 35,  timestamp: "2026-03-14T14:45:00Z" },
    ],
  },

  // ─── Lemon Shark ─────────────────────────────────────────────────────────
  {
    id: "shark-012",
    name: "Echo",
    species: "Negaprion brevirostris",
    commonName: "Lemon Shark",
    tagId: "LS-8821-L",
    lengthM: 2.9,
    weightKg: 183,
    sex: "F",
    estimatedAgeYears: 17,
    topSpeedKmh: 20,
    status: "resting",
    region: "Bahamas",
    avatarColor: "#fbbf24",
    avatarInitial: "E",
    imageUrl: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80",
    notes:
      "Studies at Bimini Biological Field Station show lemon sharks can recognise individual researchers by sight. Echo has approached the research zodiac three times unprompted.",
    lastPing: { lat: 25.7, lng: -77.4, depth: 12, timestamp: "2026-03-15T10:15:00Z" },
    pings: [
      { lat: 25.7, lng: -77.4, depth: 12, timestamp: "2026-03-15T10:15:00Z" },
      { lat: 25.5, lng: -77.6, depth: 6,  timestamp: "2026-03-15T05:00:00Z" },
      { lat: 25.3, lng: -77.8, depth: 18, timestamp: "2026-03-14T22:30:00Z" },
      { lat: 25.1, lng: -78.0, depth: 8,  timestamp: "2026-03-14T17:00:00Z" },
      { lat: 24.9, lng: -78.2, depth: 25, timestamp: "2026-03-14T10:30:00Z" },
    ],
  },

  // ─── Common Thresher ─────────────────────────────────────────────────────
  {
    id: "shark-013",
    name: "Abyss",
    species: "Alopias vulpinus",
    commonName: "Common Thresher Shark",
    tagId: "TS-2267-M",
    lengthM: 5.5,
    weightKg: 340,
    sex: "M",
    estimatedAgeYears: 23,
    topSpeedKmh: 50,
    status: "deep",
    region: "Mediterranean Sea",
    avatarColor: "#3b82f6",
    avatarInitial: "A",
    imageUrl: "https://images.unsplash.com/photo-1563685976-cf22eac4e12f?auto=format&fit=crop&w=800&q=80",
    notes:
      "Thresher sharks use their elongated upper tail lobe to stun schooling fish — a behaviour rarely captured on film. Abyss is the subject of an active tail-strike behavioural study.",
    lastPing: { lat: 36.2, lng: 14.1, depth: 450, timestamp: "2026-03-15T13:40:00Z" },
    pings: [
      { lat: 36.2, lng: 14.1,  depth: 450, timestamp: "2026-03-15T13:40:00Z" },
      { lat: 36.0, lng: 13.8,  depth: 90,  timestamp: "2026-03-15T07:00:00Z" },
      { lat: 35.8, lng: 13.5,  depth: 320, timestamp: "2026-03-15T00:15:00Z" },
      { lat: 35.6, lng: 13.2,  depth: 15,  timestamp: "2026-03-14T18:30:00Z" },
      { lat: 35.4, lng: 12.9,  depth: 200, timestamp: "2026-03-14T11:00:00Z" },
    ],
  },

  // ─── Silky Shark ─────────────────────────────────────────────────────────
  {
    id: "shark-014",
    name: "Sable",
    species: "Carcharhinus falciformis",
    commonName: "Silky Shark",
    tagId: "SS-5543-N",
    lengthM: 2.8,
    weightKg: 76,
    sex: "F",
    estimatedAgeYears: 12,
    topSpeedKmh: 35,
    status: "active",
    region: "Coral Sea",
    avatarColor: "#94a3b8",
    avatarInitial: "S",
    imageUrl: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?auto=format&fit=crop&w=800&q=80",
    notes:
      "Silky sharks are highly migratory along tuna fishing routes, making them extremely vulnerable to bycatch. Sable has been caught and released twice since tagging.",
    lastPing: { lat: -18.4, lng: 152.2, depth: 30, timestamp: "2026-03-15T14:10:00Z" },
    pings: [
      { lat: -18.4, lng: 152.2, depth: 30,  timestamp: "2026-03-15T14:10:00Z" },
      { lat: -18.8, lng: 152.6, depth: 60,  timestamp: "2026-03-15T09:30:00Z" },
      { lat: -19.2, lng: 153.0, depth: 15,  timestamp: "2026-03-15T03:00:00Z" },
      { lat: -19.6, lng: 153.4, depth: 80,  timestamp: "2026-03-14T20:15:00Z" },
      { lat: -20.0, lng: 153.8, depth: 25,  timestamp: "2026-03-14T13:30:00Z" },
    ],
  },

  // ─── Sand Tiger Shark ────────────────────────────────────────────────────
  {
    id: "shark-015",
    name: "Fang",
    species: "Carcharias taurus",
    commonName: "Sand Tiger Shark",
    tagId: "ST-9901-O",
    lengthM: 3.2,
    weightKg: 159,
    sex: "M",
    estimatedAgeYears: 19,
    topSpeedKmh: 25,
    status: "resting",
    region: "East Coast USA",
    avatarColor: "#f87171",
    avatarInitial: "F",
    imageUrl: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80",
    notes:
      "Sand tigers are the only sharks known to gulp air to maintain neutral buoyancy. Despite their fearsome appearance — multiple rows of protruding teeth — they are remarkably docile around divers.",
    lastPing: { lat: 35.1, lng: -75.6, depth: 18, timestamp: "2026-03-15T09:30:00Z" },
    pings: [
      { lat: 35.1, lng: -75.6, depth: 18, timestamp: "2026-03-15T09:30:00Z" },
      { lat: 34.8, lng: -75.8, depth: 25, timestamp: "2026-03-15T04:15:00Z" },
      { lat: 34.5, lng: -76.0, depth: 10, timestamp: "2026-03-14T21:00:00Z" },
      { lat: 34.2, lng: -76.2, depth: 35, timestamp: "2026-03-14T15:30:00Z" },
      { lat: 33.9, lng: -76.4, depth: 20, timestamp: "2026-03-14T09:00:00Z" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getTimeSinceLastPing(timestamp: string): string {
  const now  = new Date("2026-03-15T15:10:00Z");
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function getStatusGlowColor(status: SharkStatus): string {
  return (
    { active: "#00e5ff", resting: "#2dd4bf", deep: "#6366f1", unknown: "#475569" }[status]
  );
}
