"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatTeamName, isGameFinished, isGameLive, type NHLGame } from "@/app/lib/nhl-api";

interface GamesListProps {
  games: NHLGame[];
}

export default function GamesList({ games }: GamesListProps) {
  const router = useRouter();

  const handleGameClick = (gameId: number) => {
    router.push(`/boxscore/${gameId}`);
  };
  if (!games?.length) return null;

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.id}
          className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-shadow ${
            isGameLive(game)
              ? "border-green-400 bg-green-50 dark:bg-green-900"
              : isGameFinished(game)
              ? "border-gray-400 bg-gray-50 dark:bg-gray-800"
              : "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900"
          }`}
          onClick={() => handleGameClick(game.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-center flex-1">
                  <p className="font-semibold text-black dark:text-white">
                    {formatTeamName(game.awayTeam)}
                  </p>
                  {game.awayBestLine ? (
                    <p className="text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-white mt-1">
                      {(() => {
                        const logo = game.oddsPartners?.find(p => p.name?.toLowerCase() === "draftkings")?.imageUrl
                          || game.oddsPartners?.find(p => p.name?.toLowerCase() === "fanduel")?.imageUrl;
                        return logo ? (
                          <Image src={logo} alt="Odds Provider" width={14} height={14} className="h-3 w-auto" />
                        ) : null;
                      })()}
                      <span className="font-semibold">{game.awayBestLine}</span>
                    </p>
                  ) : null}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {game.awayTeam.abbreviation}
                  </p>
                </div>

                <div className="text-center mx-4">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-black dark:text-white">
                      {game.awayScore !== undefined ? game.awayScore : "-"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">@</p>
                    <p className="text-2xl font-bold text-black dark:text-white">
                      {game.homeScore !== undefined ? game.homeScore : "-"}
                    </p>
                  </div>
                </div>

                <div className="text-center flex-1">
                  <p className="font-semibold text-black dark:text-white">
                    {formatTeamName(game.homeTeam)}
                  </p>
                  {game.homeBestLine ? (
                    <p className="text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-white mt-1">
                      {(() => {
                        const logo = game.oddsPartners?.find(p => p.name?.toLowerCase() === "draftkings")?.imageUrl
                          || game.oddsPartners?.find(p => p.name?.toLowerCase() === "fanduel")?.imageUrl;
                        return logo ? (
                          <Image src={logo} alt="Odds Provider" width={14} height={14} className="h-3 w-auto" />
                        ) : null;
                      })()}
                      <span className="font-semibold">{game.homeBestLine}</span>
                    </p>
                  ) : null}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {game.homeTeam.abbreviation}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isGameLive(game)
                      ? "bg-green-500 text-white"
                      : isGameFinished(game)
                      ? "bg-gray-500 text-white"
                      : "bg-orange-500 text-black"
                  }`}
                >
                  {game.status}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1" suppressHydrationWarning>
                  {new Date(game.gameDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "America/New_York",
                  })} ET
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
