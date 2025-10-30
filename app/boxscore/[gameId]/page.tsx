import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Landing from "./Landing";

interface BoxscoreData {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  startTimeUTC?: string;
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
  const bs = boxscore!;
  const { awayTeam, homeTeam, gameState, clock, periodDescriptor, venue } = bs;
  // Fetch odds for this game from the score endpoint using the game's date (ET)
  async function getOddsForGame() {
    try {
      // Derive the score endpoint date from the game's UTC start time when available
      const sourceIso = bs.startTimeUTC ? bs.startTimeUTC : `${bs.gameDate}T00:00:00Z`;
      const easternDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(sourceIso));
      const res = await fetch(`https://api-web.nhle.com/v1/score/${easternDate}`, { next: { revalidate: 120 } });
      if (!res.ok) return null;
      const json = await res.json();
      type ApiOddsLine = { providerId?: number | string; value?: string | number };
      type ApiScoreTeam = { odds?: ApiOddsLine[] };
      type ApiScoreGame = { id?: number | string; gameId?: number | string; homeTeam?: ApiScoreTeam; awayTeam?: ApiScoreTeam };
      type ApiOddsPartner = { name?: string; imageUrl?: string; partnerId?: number | string };
      const games: ApiScoreGame[] = Array.isArray(json?.games) ? (json.games as ApiScoreGame[]) : [];
      const match = games.find((g) => String(g?.id ?? g?.gameId ?? '') === String(bs.id));
      if (!match) return null;
      const partners: ApiOddsPartner[] = Array.isArray(json?.oddsPartners) ? (json.oddsPartners as ApiOddsPartner[]) : [];
      const dk = partners.find((p) => typeof p?.name === 'string' && p.name.trim().toLowerCase() === 'draftkings');
      const fd = partners.find((p) => typeof p?.name === 'string' && p.name.trim().toLowerCase() === 'fanduel');
      const selected = dk ?? fd ?? null;
      const selectedId = selected?.partnerId !== undefined ? Number(selected.partnerId) : undefined;
      const awayArr = Array.isArray(match?.awayTeam?.odds) ? (match.awayTeam!.odds as ApiOddsLine[]) : [];
      const homeArr = Array.isArray(match?.homeTeam?.odds) ? (match.homeTeam!.odds as ApiOddsLine[]) : [];
      const pick = (arr: ApiOddsLine[]): string | null => {
        if (!arr.length) return null;
        if (selectedId !== undefined) {
          const m = arr.find((o) => Number(o?.providerId) === selectedId);
          if (m && (typeof m.value === 'string' || typeof m.value === 'number')) return String(m.value);
        }
        const f = arr[0];
        return f && (typeof f.value === 'string' || typeof f.value === 'number') ? String(f.value) : null;
      };
      return {
        providerImageUrl: typeof selected?.imageUrl === 'string' ? (selected.imageUrl as string) : null,
        awayValue: pick(awayArr),
        homeValue: pick(homeArr),
      };
    } catch {
      return null;
    }
  }
  const odds = await getOddsForGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-black dark:to-orange-900">
      {/* Header */}
      <header className="bg-black border-b-4 border-orange-500">
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/todays-tilts" 
              className="text-lg font-semibold text-orange-400 hover:text-orange-300 transition-colors"
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
        <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 mb-6">
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
                'bg-orange-500 text-black'
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

        {/* Landing details (broadcasts, leaders, tickets, records) */}
        <div className="mt-8">
          <Landing gameId={gameId} />
        </div>

        {/* Odds (best available shown simply) */}
        {odds ? (
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-4">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-2">Odds</h3>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black text-white">
                {odds.providerImageUrl ? (
                  <Image src={odds.providerImageUrl} alt="Odds Provider" width={14} height={14} className="h-3 w-auto" />
                ) : null}
                <span>{awayTeam.abbrev}</span>
                <span className="font-bold">{odds.awayValue ?? '-'}</span>
              </div>
              <div className="text-gray-500">@</div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black text-white">
                {odds.providerImageUrl ? (
                  <Image src={odds.providerImageUrl} alt="Odds Provider" width={14} height={14} className="h-3 w-auto" />
                ) : null}
                <span>{homeTeam.abbrev}</span>
                <span className="font-bold">{odds.homeValue ?? '-'}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Player Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Away Team */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4 text-center">
              {awayTeam.abbrev} - Forwards
            </h3>
            <div className="space-y-2">
              {boxscore.playerByGameStats?.awayTeam?.forwards?.length
                ? boxscore.playerByGameStats.awayTeam.forwards.slice(0, 6).map((player, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-600">#{player.sweaterNumber}</span>
                        <span className="font-medium text-black dark:text-white">{player.name.default}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {player.goals}G {player.assists}A {player.points}P • {player.toi}
                      </div>
                    </div>
                  ))
                : (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">Player stats will appear once the game starts.</div>
                  )}
            </div>
          </div>

          {/* Home Team */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4 text-center">
              {homeTeam.abbrev} - Forwards
            </h3>
            <div className="space-y-2">
              {boxscore.playerByGameStats?.homeTeam?.forwards?.length
                ? boxscore.playerByGameStats.homeTeam.forwards.slice(0, 6).map((player, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-orange-600">#{player.sweaterNumber}</span>
                        <span className="font-medium text-black dark:text-white">{player.name.default}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {player.goals}G {player.assists}A {player.points}P • {player.toi}
                      </div>
                    </div>
                  ))
                : (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">Player stats will appear once the game starts.</div>
                  )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
