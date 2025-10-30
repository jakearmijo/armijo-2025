"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GamesList from "./GamesList";
import type { NHLGame } from "@/app/lib/nhl-api";
import { isGameLive } from "@/app/lib/nhl-api";

interface Props {
  initialGames: NHLGame[];
  pollIntervalMs?: number;
}

export default function TodaysGamesLive({ initialGames, pollIntervalMs = 30000 }: Props) {
  const [games, setGames] = useState<NHLGame[]>(initialGames);
  const [live, setLive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const controller = useMemo(() => new AbortController(), []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/nhl/todays-games", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      if (Array.isArray(json.games)) setGames(json.games);
    } catch {
      // ignore transient errors in live mode
    } finally {
      setLoading(false);
    }
  }, [controller]);

  const hasLiveGame = useMemo(() => games.some((g) => isGameLive(g)), [games]);

  // One-time refresh on mount and when toggling live on
  useEffect(() => {
    if (!live) return;
    refresh();
  }, [live, refresh]);

  // Manage polling interval only when there is at least one live game
  useEffect(() => {
    if (!live || !hasLiveGame) return;
    timerRef.current = setInterval(refresh, pollIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [live, hasLiveGame, pollIntervalMs, refresh]);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLive((v) => !v)}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              live
                ? "bg-orange-500 text-black border-orange-600"
                : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            {live ? "Live Updates: On" : "Live Updates: Off"}
          </button>
          <button
            onClick={refresh}
            className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Refresh Now
          </button>
        </div>
        {loading ? (
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
            <span className="mr-2">Updating…</span>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></span>
          </div>
        ) : null}
      </div>

      <GamesList games={games} />
    </div>
  );
}
