import Image from "next/image";

interface LandingData {
  id: number;
  gameDate: string;
  startTimeUTC?: string;
  gameState: string;
  venue?: { default?: string };
  venueLocation?: { default?: string };
  tvBroadcasts?: Array<{ network?: string; market?: string; countryCode?: string }>;
  awayTeam: { abbrev: string; logo?: string; darkLogo?: string; record?: string; placeName?: { default?: string }; commonName?: { default?: string } };
  homeTeam: { abbrev: string; logo?: string; darkLogo?: string; record?: string; placeName?: { default?: string }; commonName?: { default?: string } };
  matchup?: {
    skaterComparison?: {
      contextLabel?: string;
      leaders?: Array<{
        category: string;
        awayLeader?: { name?: { default?: string }; headshot?: string; value?: number };
        homeLeader?: { name?: { default?: string }; headshot?: string; value?: number };
      }>;
    };
    goalieComparison?: {
      homeTeam?: { teamTotals?: { record?: string; gaa?: number; savePctg?: number } };
      awayTeam?: { teamTotals?: { record?: string; gaa?: number; savePctg?: number } };
    };
  };
  ticketsLink?: string;
}

async function getLanding(gameId: string): Promise<LandingData | null> {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Landing({ gameId }: { gameId: string }) {
  const landing = await getLanding(gameId);
  if (!landing) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
        <p className="text-sm text-gray-700 dark:text-gray-300">Landing data unavailable.</p>
      </div>
    );
  }

  const broadcasts = landing.tvBroadcasts ?? [];
  const leaders = landing.matchup?.skaterComparison?.leaders ?? [];
  const homeTotals = landing.matchup?.goalieComparison?.homeTeam?.teamTotals;
  const awayTotals = landing.matchup?.goalieComparison?.awayTeam?.teamTotals;

  return (
    <section className="space-y-6">
      {/* Broadcasts & Tickets */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Broadcasts</h3>
            {broadcasts.length ? (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {broadcasts.map(b => b.network).filter(Boolean).join(" • ")}
              </p>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">TBD</p>
            )}
          </div>
          {landing.ticketsLink ? (
            <a
              href={landing.ticketsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 text-black font-medium hover:bg-orange-600"
            >
              Get Tickets
            </a>
          ) : null}
        </div>
      </div>

      {/* Team Records & Logos */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          <div className="flex items-center gap-3">
            {landing.awayTeam.logo ? (
              <Image
                src={landing.awayTeam.logo}
                alt={`${landing.awayTeam.abbrev} logo`}
                width={80}
                height={80}
                className="h-10 w-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            ) : null}
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Away</div>
              <div className="text-xl font-bold text-black dark:text-white">{landing.awayTeam.abbrev}</div>
              {landing.awayTeam.record ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">Record: {landing.awayTeam.record}</div>
              ) : null}
            </div>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-300">vs</div>
          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Home</div>
              <div className="text-xl font-bold text-black dark:text-white">{landing.homeTeam.abbrev}</div>
              {landing.homeTeam.record ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">Record: {landing.homeTeam.record}</div>
              ) : null}
            </div>
            {landing.homeTeam.logo ? (
              <Image
                src={landing.homeTeam.logo}
                alt={`${landing.homeTeam.abbrev} logo`}
                width={80}
                height={80}
                className="h-10 w-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            ) : null}
          </div>
        </div>
        {(homeTotals || awayTotals) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm text-gray-700 dark:text-gray-300">
            <div className="p-4 rounded border border-gray-200 dark:border-gray-800">
              <div className="font-semibold mb-1">{landing.awayTeam.abbrev} Goalie Team Totals</div>
              <div>Record: {awayTotals?.record ?? "-"}</div>
              <div>GAA: {awayTotals?.gaa?.toFixed?.(2) ?? "-"}</div>
              <div>SV%: {awayTotals?.savePctg?.toFixed?.(3) ?? "-"}</div>
            </div>
            <div className="p-4 rounded border border-gray-200 dark:border-gray-800">
              <div className="font-semibold mb-1">{landing.homeTeam.abbrev} Goalie Team Totals</div>
              <div>Record: {homeTotals?.record ?? "-"}</div>
              <div>GAA: {homeTotals?.gaa?.toFixed?.(2) ?? "-"}</div>
              <div>SV%: {homeTotals?.savePctg?.toFixed?.(3) ?? "-"}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Leaders - last 5 games */}
      {leaders.length ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Skater Leaders (last 5)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.slice(0, 3).map((row, idx) => (
              <div key={idx} className="p-4 rounded border border-gray-200 dark:border-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 capitalize">{row.category}</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {row.awayLeader?.headshot ? (
                      <Image src={row.awayLeader.headshot} alt="away leader" width={36} height={36} className="rounded" />
                    ) : null}
                    <div className="text-sm">
                      <div className="font-medium text-black dark:text-white">Away</div>
                      <div className="text-gray-700 dark:text-gray-300">{row.awayLeader?.name?.default ?? "-"}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-black dark:text-white">{row.awayLeader?.value ?? "-"}</div>
                </div>
                <div className="h-px my-3 bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {row.homeLeader?.headshot ? (
                      <Image src={row.homeLeader.headshot} alt="home leader" width={36} height={36} className="rounded" />
                    ) : null}
                    <div className="text-sm">
                      <div className="font-medium text-black dark:text-white">Home</div>
                      <div className="text-gray-700 dark:text-gray-300">{row.homeLeader?.name?.default ?? "-"}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-black dark:text-white">{row.homeLeader?.value ?? "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
