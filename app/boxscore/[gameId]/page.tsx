import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface BoxscoreData {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: { default: string };
  venueLocation: { default: string };
  gameState: string;
  periodDescriptor: { number: number; periodType: string };
  awayTeam: {
    id: number;
    commonName: { default: string };
    abbrev: string;
    score: number;
    sog: number;
    placeName: { default: string };
  };
  homeTeam: {
    id: number;
    commonName: { default: string };
    abbrev: string;
    score: number;
    sog: number;
    placeName: { default: string };
  };
  clock: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  playerByGameStats: {
    awayTeam: {
      forwards: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        toi: string;
        sog: number;
      }>;
      defense: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        toi: string;
        sog: number;
      }>;
      goalies: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        savePctg: number;
        goalsAgainst: number;
        toi: string;
        shotsAgainst: number;
        saves: number;
      }>;
    };
    homeTeam: {
      forwards: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        toi: string;
        sog: number;
      }>;
      defense: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        toi: string;
        sog: number;
      }>;
      goalies: Array<{
        playerId: number;
        sweaterNumber: number;
        name: { default: string };
        position: string;
        savePctg: number;
        goalsAgainst: number;
        toi: string;
        shotsAgainst: number;
        saves: number;
      }>;
    };
  };
}

async function getBoxscore(gameId: string): Promise<BoxscoreData | null> {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/gamecenter/${gameId}/boxscore`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch {
    return null;
  }
}

export default async function BoxscorePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const boxscore = await getBoxscore(gameId);

  if (!boxscore) {
    notFound();
  }

  const { awayTeam, homeTeam, gameState, clock, periodDescriptor, venue } = boxscore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-black dark:to-red-900">
      {/* Header */}
      <header className="bg-red-600 border-b-4 border-black">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/todays-tilts" 
              className="text-lg font-semibold text-white hover:text-red-200 transition-colors"
            >
              ← Back to Games
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image 
                  src="/nhl-logo.svg" 
                  alt="NHL Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Game Boxscore
              </h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-6 py-8">
        {/* Game Info */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-red-200 dark:border-red-800 p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              {awayTeam.placeName.default} {awayTeam.commonName.default} @ {homeTeam.placeName.default} {homeTeam.commonName.default}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {venue.default} • {new Date(boxscore.gameDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                gameState === 'LIVE' ? 'bg-green-500 text-white' : 
                gameState === 'FINAL' ? 'bg-gray-500 text-white' : 
                'bg-red-600 text-white'
              }`}>
                {gameState}
              </span>
              {clock.inIntermission && (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-500 text-black">
                  INTERMISSION
                </span>
              )}
              {gameState === 'LIVE' && (
                <span className="text-lg font-bold text-black dark:text-white">
                  {clock.timeRemaining} - Period {periodDescriptor.number}
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-8 my-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{awayTeam.abbrev}</div>
              <div className="text-4xl font-bold text-black dark:text-white">{awayTeam.score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">SOG: {awayTeam.sog}</div>
            </div>
            <div className="text-2xl font-bold text-gray-500">@</div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{homeTeam.abbrev}</div>
              <div className="text-4xl font-bold text-black dark:text-white">{homeTeam.score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">SOG: {homeTeam.sog}</div>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Away Team */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4 text-center">
              {awayTeam.abbrev} - Forwards
            </h3>
            <div className="space-y-2">
              {boxscore.playerByGameStats.awayTeam.forwards.slice(0, 6).map((player, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">#{player.sweaterNumber}</span>
                    <span className="font-medium text-black dark:text-white">{player.name.default}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {player.goals}G {player.assists}A {player.points}P • {player.toi}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home Team */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4 text-center">
              {homeTeam.abbrev} - Forwards
            </h3>
            <div className="space-y-2">
              {boxscore.playerByGameStats.homeTeam.forwards.slice(0, 6).map((player, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">#{player.sweaterNumber}</span>
                    <span className="font-medium text-black dark:text-white">{player.name.default}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {player.goals}G {player.assists}A {player.points}P • {player.toi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
