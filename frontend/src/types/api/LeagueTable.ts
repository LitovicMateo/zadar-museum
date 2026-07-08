/** Raw standings row as stored in the `standings` JSON column (team = numeric id). */
export interface LeagueTableStandingRaw {
	team: number;
	teamName: string | null;
	teamShortName: string | null;
	gamesPlayed: number;
	wins: number;
	draws: number | null;
	losses: number;
	pointsDiff: number;
	points: number;
}

/** A single league-table record loaded for editing (competition relation populated). */
export interface LeagueTableRecord {
	id: number;
	documentId: string;
	season: string;
	stageNumber: number;
	stageName: string | null;
	competition?: { id: number; documentId: string; name: string } | null;
	standings: LeagueTableStandingRaw[];
}

/** Standings row enriched with resolved team info by the by-league endpoint. */
export interface LeagueTableStanding {
	position: number;
	teamId: number;
	teamName: string | null;
	teamShortName: string | null;
	teamSlug: string | null;
	teamImage: string | null;
	gamesPlayed: number;
	wins: number;
	draws: number | null;
	losses: number;
	pointsDiff: number;
	points: number;
}

/** One stage's final standings, as returned by GET /league-tables/by-league/:slug/:season. */
export interface LeagueTableByLeague {
	id: number;
	documentId: string;
	season: string;
	stageNumber: number;
	stageName: string | null;
	standings: LeagueTableStanding[];
}
