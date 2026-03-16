import { NextResponse } from "next/server";
import type { Shark, SharkStatus } from "@/data/sharks";

const MAPOTIC_URL =
  "https://mapotic.com/api/v1/maps/3413/pois.geojson/?format=json";

// Revalidate cached data every 15 minutes
export const revalidate = 900;

export async function GET() {
  try {
    const res = await fetch(MAPOTIC_URL, {
      next: { revalidate: 900 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ApexTracker/1.0; +https://apextracker.app)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: 502 }
      );
    }

    const geojson = (await res.json()) as { features: MapoticFeature[] };

    const sharks: Shark[] = geojson.features
      .filter(
        (f) =>
          f.properties.is_published &&
          f.geometry?.coordinates?.length === 2 &&
          f.properties.last_move_datetime
      )
      .map(normalizeShark)
      .sort(
        (a, b) =>
          new Date(b.lastPing.timestamp).getTime() -
          new Date(a.lastPing.timestamp).getTime()
      );

    return NextResponse.json({
      sharks,
      total: sharks.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[/api/sharks]", err);
    return NextResponse.json(
      { error: "Failed to fetch shark data from OCEARCH" },
      { status: 503 }
    );
  }
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

function parseLengthToMeters(raw: string): number {
  if (!raw) return 0;
  // "12 ft 5 in." or "9 ft 2 in."
  const ftIn = raw.match(/(\d+)\s*ft\.?\s*(\d+)?\s*in\.?/i);
  if (ftIn) {
    const ft = parseInt(ftIn[1]) || 0;
    const inch = parseInt(ftIn[2]) || 0;
    return Math.round((ft * 0.3048 + inch * 0.0254) * 10) / 10;
  }
  // "3.8 m"
  const m = raw.match(/([\d.]+)\s*m/i);
  if (m) return parseFloat(m[1]);
  return 0;
}

function parseWeightToKg(raw: string): number {
  if (!raw) return 0;
  // "1,142 lbs" or "250 lb"
  const lbs = raw.match(/([\d,]+)\s*lbs?/i);
  if (lbs) return Math.round(parseInt(lbs[1].replace(/,/g, "")) * 0.453592);
  // "520 kg"
  const kg = raw.match(/([\d,]+)\s*kg/i);
  if (kg) return parseInt(kg[1].replace(/,/g, ""));
  return 0;
}

function parseSpecies(raw: string): { commonName: string; species: string } {
  if (!raw) return { commonName: "Unknown Species", species: "Unknown" };
  // "White Shark (Carcharodon carcharias)"
  const match = raw.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (match) return { commonName: match[1].trim(), species: match[2].trim() };
  return { commonName: raw, species: raw };
}

function inferStatus(lastMoveDatetime: string): SharkStatus {
  const msAgo = Date.now() - new Date(lastMoveDatetime).getTime();
  const daysAgo = msAgo / (1000 * 60 * 60 * 24);
  if (daysAgo < 30) return "active";
  if (daysAgo < 365) return "resting";
  return "unknown";
}

const AVATAR_COLORS = [
  "#00e5ff", "#14f5d8", "#4d9fff", "#6366f1", "#2dd4bf",
  "#a78bfa", "#34d399", "#f87171", "#fbbf24", "#60a5fa",
  "#818cf8", "#ef4444", "#3b82f6", "#fb923c", "#e879f9",
];

function avatarColor(name: string): string {
  let h = 0;
  for (const c of name) h = name.charCodeAt(0) + ((h << 5) - h);
  // Better distribution: use each character
  for (let i = 0; i < name.length; i++)
    h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function normalizeShark(f: MapoticFeature): Shark {
  const p = f.properties;
  const [lng, lat] = f.geometry.coordinates;
  const { commonName, species } = parseSpecies(p.species ?? "");

  return {
    id: String(p.id),
    name: p.name,
    species,
    commonName,
    tagId: `OCE-${p.id}`,
    lengthM: parseLengthToMeters(p.length ?? ""),
    weightKg: parseWeightToKg(p.weight ?? ""),
    sex: p.gender === "Female" ? "F" : p.gender === "Male" ? "M" : "U",
    stageOfLife: p.stage_of_life ?? "Unknown",
    status: inferStatus(p.last_move_datetime),
    lastPing: {
      lat,
      lng,
      depth: 0,
      timestamp: p.last_move_datetime,
    },
    pings: [],
    region: p.tag_location ?? "Unknown",
    imageUrl: p.image ?? "",
    avatarColor: avatarColor(p.name),
    avatarInitial: p.name.charAt(0).toUpperCase(),
  };
}

// ─── Mapotic GeoJSON types ────────────────────────────────────────────────────

interface MapoticFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: number;
    name: string;
    species: string | null;
    gender: string | null;
    length: string | null;
    weight: string | null;
    tag_location: string | null;
    stage_of_life: string | null;
    last_move_datetime: string;
    image: string | null;
    is_published: boolean;
    zping: boolean;
    zping_datetime: string | null;
  };
}
