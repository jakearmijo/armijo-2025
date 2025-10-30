import { NextResponse } from "next/server";
import { getTodaysGames } from "@/app/lib/nhl-api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const games = await getTodaysGames();
    return NextResponse.json(
      { games },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load today's games" },
      { status: 500 }
    );
  }
}
