// NHL API utility functions based on https://github.com/Zmalski/NHL-API-Reference
const NHL_WEB_API_BASE = 'https://api-web.nhle.com/v1';

export interface NHLGame {
  id: number;
  gameDate: string;
  homeTeam: NHLTeam; // includes city
  awayTeam: NHLTeam; // includes city
  status: string;
  homeScore?: number;
  awayScore?: number;
  homeOdds?: NHLOddsLine[];
  awayOdds?: NHLOddsLine[];
  oddsPartners?: NHLOddsPartner[];
  homeBestLine?: string;
  awayBestLine?: string;
}

export interface NHLTeam {
  id: number;
  name: string;
  abbreviation: string;
  city: string | null;
}

export interface NHLPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  team: NHLTeam;
}

export interface NHLStandings {
  team: NHLTeam;
  points: number;
  wins: number;
  losses: number;
  otLosses: number;
  gamesPlayed: number;
}

export interface NHLOddsPartner {
  partnerId: number;
  name: string;
  imageUrl?: string;
  siteUrl?: string;
}

export interface NHLOddsLine {
  providerId: number;
  value: string;
}

type ApiOddsPartner = {
  partnerId?: number | string;
  name?: string;
  imageUrl?: string;
  siteUrl?: string;
};

type ApiOddsLine = {
  providerId?: number | string;
  value?: string | number;
};

// Get today's NHL games
export async function getTodaysGames(): Promise<NHLGame[]> {
  try {
    // Compute today's date in Eastern Time (America/New_York)
    const easternToday = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()); // en-CA => YYYY-MM-DD

    const response = await fetch(`${NHL_WEB_API_BASE}/score/${easternToday}`, {
      // Server fetch with ISR; client polling handles live updates
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch today's games: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rawGames = Array.isArray(data?.games) ? data.games : [];
    const partners: NHLOddsPartner[] = Array.isArray(data?.oddsPartners)
      ? (data.oddsPartners as ApiOddsPartner[]).map((p) => ({
          partnerId: Number(p?.partnerId),
          name: typeof p?.name === 'string' ? p.name : '',
          imageUrl: typeof p?.imageUrl === 'string' ? p.imageUrl : undefined,
          siteUrl: typeof p?.siteUrl === 'string' ? p.siteUrl : undefined,
        }))
      : [];

    type ApiTeam = {
      id?: number | string;
      abbrev?: string;
      abbreviation?: string;
      teamName?: string;
      commonName?: { default?: string };
      placeName?: { default?: string };
      score?: number;
    };
    type ApiGame = {
      id?: number | string;
      gamePk?: number | string;
      gameId?: number | string;
      startTimeUTC?: string;
      gameDate?: string;
      gameState?: string;
      status?: { state?: string };
      homeTeam?: ApiTeam;
      awayTeam?: ApiTeam;
    };
    const pickGameCenterId = (g: ApiGame): number => {
      const candidates = [g.gameId, g.id, g.gamePk].filter((v) => v !== undefined && v !== null) as Array<string | number>;
      for (const v of candidates) {
        const s = String(v);
        if (/^\d{10}$/.test(s)) return Number(s);
      }
      // Fallback to numeric if possible
      if (candidates.length > 0 && !Number.isNaN(Number(candidates[0]))) return Number(candidates[0]);
      // Last resort: timestamp-derived but not ideal
      return Date.parse(g.startTimeUTC ?? g.gameDate ?? new Date().toISOString());
    };

    const pickBestLine = (
      lines?: ReadonlyArray<{ providerId?: number | string; value?: string }>,
      partnersList?: ReadonlyArray<NHLOddsPartner>
    ): string | undefined => {
      if (!Array.isArray(lines) || lines.length === 0) return undefined;
      const byProvider = new Map<number, string>();
      for (const l of lines) {
        const id = Number(l?.providerId);
        const v = typeof l?.value === 'string' ? l.value : undefined;
        if (!Number.isNaN(id) && v) byProvider.set(id, v);
      }
      const dk = (partnersList || []).find(
        (p) => typeof p?.name === 'string' && p.name.trim().toLowerCase() === 'draftkings'
      );
      if (dk && byProvider.has(Number(dk.partnerId))) return byProvider.get(Number(dk.partnerId));
      const fd = (partnersList || []).find(
        (p) => typeof p?.name === 'string' && p.name.trim().toLowerCase() === 'fanduel'
      );
      if (fd && byProvider.has(Number(fd.partnerId))) return byProvider.get(Number(fd.partnerId));
      return [...byProvider.values()][0];
    };

    const normalized: NHLGame[] = (rawGames as ApiGame[]).map((g) => {
      const home = g.homeTeam || {};
      const away = g.awayTeam || {};
      const homeTeam: NHLTeam = {
        id: Number(home.id ?? 0),
        name: home.commonName?.default ?? home.teamName ?? home.abbrev ?? 'Home',
        abbreviation: home.abbrev ?? home.abbreviation ?? '',
        city: typeof home.placeName?.default === 'string' ? home.placeName.default : null,
      };
      const awayTeam: NHLTeam = {
        id: Number(away.id ?? 0),
        name: away.commonName?.default ?? away.teamName ?? away.abbrev ?? 'Away',
        abbreviation: away.abbrev ?? away.abbreviation ?? '',
        city: typeof away.placeName?.default === 'string' ? away.placeName.default : null,
      };

      const gameState: string = g.gameState ?? g.status?.state ?? 'Scheduled';
      const status = gameState === 'LIVE' || gameState === 'CRIT' ? 'Live'
        : gameState === 'FINAL' || gameState === 'OFF' ? 'Final'
        : 'Scheduled';

      const homeOddsSource = (home as { odds?: ApiOddsLine[] }).odds;
      const homeOdds = Array.isArray(homeOddsSource)
        ? homeOddsSource.map((o) => ({ providerId: Number(o?.providerId), value: String(o?.value ?? '') }))
        : undefined;
      const awayOddsSource = (away as { odds?: ApiOddsLine[] }).odds;
      const awayOdds = Array.isArray(awayOddsSource)
        ? awayOddsSource.map((o) => ({ providerId: Number(o?.providerId), value: String(o?.value ?? '') }))
        : undefined;

      return {
        id: pickGameCenterId(g),
        gameDate: g.startTimeUTC ?? g.gameDate ?? new Date().toISOString(),
        homeTeam,
        awayTeam,
        status,
        homeScore: typeof home.score === 'number' ? home.score : undefined,
        awayScore: typeof away.score === 'number' ? away.score : undefined,
        homeOdds,
        awayOdds,
        oddsPartners: partners,
        homeBestLine: pickBestLine(homeOdds, partners),
        awayBestLine: pickBestLine(awayOdds, partners),
      } as NHLGame;
    });

    return normalized;
  } catch (error) {
    console.error('Error fetching today\'s games:', error);
    return [];
  }
}

// Get NHL teams
export async function getNHLTeams(): Promise<NHLTeam[]> {
  try {
    const response = await fetch(`${NHL_WEB_API_BASE}/team`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching NHL teams:', error);
    return [];
  }
}

// Get current standings
export async function getCurrentStandings(): Promise<NHLStandings[]> {
  try {
    const response = await fetch(`${NHL_WEB_API_BASE}/standings/now`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch standings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.standings || [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
}

// Get team stats for current season
export async function getTeamStats(teamId: number) {
  try {
    const currentSeason = '20252026'; // Update this for current season
    const response = await fetch(
      `${NHL_WEB_API_BASE}/team/summary?cayenneExp=seasonId=${currentSeason}%20and%20gameTypeId=2&sort=points&dir=DESC`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch team stats: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data?.find((team: { teamId: number }) => team.teamId === teamId) || null;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return null;
  }
}

// Get player stats leaders
export async function getPlayerLeaders(statType: string = 'points') {
  try {
    const currentSeason = '20252026';
    const response = await fetch(
      `${NHL_WEB_API_BASE}/leaders/skaters/${statType}?cayenneExp=seasonId=${currentSeason}%20and%20gameTypeId=2&limit=10`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch player leaders: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching player leaders:', error);
    return [];
  }
}

// Get game details by ID
export async function getGameDetails(gameId: number) {
  try {
    const response = await fetch(`${NHL_WEB_API_BASE}/gamecenter/${gameId}/play-by-play`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game details: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

// Get schedule for a specific date range
export async function getSchedule(startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `${NHL_WEB_API_BASE}/schedule?startDate=${startDate}&endDate=${endDate}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schedule: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.gameWeek || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

// Utility function to format team names
export function formatTeamName(team: NHLTeam): string {
  const city = team.city ?? '';
  const name = team.name ?? '';
  const full = `${city} ${name}`.trim();
  return full.length > 0 ? full : (team.abbreviation || 'N/A');
}

// Utility function to get team abbreviation
export function getTeamAbbreviation(team: NHLTeam): string {
  return team.abbreviation;
}

// Utility function to check if game is live
export function isGameLive(game: NHLGame): boolean {
  return game.status === 'Live' || game.status === 'In Progress';
}

// Utility function to check if game is finished
export function isGameFinished(game: NHLGame): boolean {
  return game.status === 'Final' || game.status === 'Game Over';
}
