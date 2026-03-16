import { NextResponse } from "next/server";
import type { SharkPing } from "@/data/sharks";

export const revalidate = 900;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(
      `https://mapotic.com/api/v1/maps/3413/pois/${id}/motion/with-meta/?format=json`,
      {
        next: { revalidate: 900 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ApexTracker/1.0; +https://apextracker.app)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      motion: Array<{
        dt_move: string;
        point: { coordinates: [number, number] };
      }>;
    };

    const pings: SharkPing[] = (data.motion ?? [])
      .map((m) => ({
        lat: m.point.coordinates[1],
        lng: m.point.coordinates[0],
        depth: 0,
        timestamp: m.dt_move,
      }))
      .reverse(); // most recent first

    return NextResponse.json({ pings });
  } catch (err) {
    console.error(`[/api/sharks/${id}/pings]`, err);
    return NextResponse.json(
      { error: "Failed to fetch ping history" },
      { status: 503 }
    );
  }
}
