import TodaysGamesLive from "./TodaysGamesLive";
import { getTodaysGames } from "@/app/lib/nhl-api";

export default async function TodaysGames() {
  const games = await getTodaysGames();

  if (games.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-2">No Games Today</h3>
          <p className="text-gray-600 dark:text-gray-300">Check back tomorrow for NHL action!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
        Today&apos;s NHL Games
      </h3>

      {/* Client live updater with initial data */}
      <TodaysGamesLive initialGames={games} pollIntervalMs={30000} />
    </div>
  );
}
