import { StrapiImage } from './Strapi';

export interface TeamDetailsResponse {
	id: number;
	documentId: string;
	name: string;
	city: string;
	slug: string;
	short_name: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	country: string;
	image: StrapiImage;
	alternate_names: AlternateName[];
	isMainTeam: boolean;
}

type AlternateName = {
	name: string;
	short_name: string;
};

export type TeamFormData = {
	main_name: string;
	short_name: string;
	city: string;
	image: File | null;
	country: string;
	alternate_names: AlternateName[];
};

export interface TeamCompetitionsResponse {
	league_name: string;
	league_id: string;
	league_slug: string;
	league_short_name: string;
}

export type TeamSeasonsResponse = string[];

export interface TeamHeadToHeadResposne {
	opponent_id: number;
	opponent_name: string;
	opponent_slug: string;
	games_played: number;
	main_team_wins: number;
	opponent_wins: number;
	main_team_win_percentage: number;
	opponent_win_percentage: number;
}

export interface TeamScheduleResponse {
	game_id: number;
	game_document_id: string;
	game_date: string; // ISO date string
	season: string;
	stage: string;
	round: string;
	group_name?: string;

	league_id: string;
	league_name: string;
	league_short_name?: string;
	competition_slug: string;

	home_team_id: string;
	home_team_name: string;
	home_team_short_name: string;
	home_team_slug: string;
	home_score: number | null;

	away_team_id: string;
	away_team_name: string;
	away_team_short_name: string;
	away_team_slug: string;
	away_score: number | null;
}

export interface LeagueStats {
	leagueId: string;
	leagueSlug: string;
	teamId: string;
	teamSlug: string;
	stats: TeamLeagueRecord[];
}

export interface LeagueSeasonStats {
	leagueId: string;
	leagueSlug: string;
	teamId: string;
	teamSlug: string;
	season?: string;
	stats: {
		total: TeamLeagueRecord;
		home: TeamLeagueRecord;
		away: TeamLeagueRecord;
	};
}

export interface TeamLeagueRecord {
	key: string;
	leagueId: string;
	leagueSlug: string;
	games: string;
	wins: string;
	losses: string;
	win_percentage: number;
	points_diff: number;
	attendance: number;
	points_scored: number;
	points_received: number;
}

export interface TeamLeagueStatsResponse {
	teamId: string;
	teamSlug: string;
	teamName: string;
	competitionSlug: string;
	leagueName: string;
	total: LeagueStats;
	home: LeagueStats;
	away: LeagueStats;
}

export interface TeamLeagueStatsRow extends LeagueStats {
	teamId: string;
	teamSlug: string;
	teamName: string;
	competitionSlug: string;
	leagueName: string;
}

export interface TeamBoxscoreResponse {
	id: number;
	game_id: string;
	season: string;
	stage: string;
	round: string;
	competition: string;
	competition_slug: string;
	game_date: string; // ISO date string, can cast to Date if needed
	team_document_id: string;
	team_name: string;
	team_short_name: string;
	team_slug: string;
	first_quarter: number;
	second_quarter: number;
	third_quarter: number;
	fourth_quarter: number;
	overtime: number | null;
	field_goals_made: number | null;
	field_goals_attempted: number | null;
	field_goals_percentage: number | null;
	three_pointers_made: number | null;
	three_pointers_attempted: number | null;
	three_pointers_percentage: number | null;
	free_throws_made: number | null;
	free_throws_attempted: number | null;
	free_throws_percentage: number | null;
	offensive_rebounds: number;
	defensive_rebounds: number;
	rebounds: number;
	assists: number | null;
	turnovers: number | null;
	blocks: number | null;
	steals: number | null;
	fouls: number | null;
}

// Reusable interface for team stats in a specific context (Home, Away, Total)
export interface TeamStats {
	key: 'Home' | 'Away' | 'Neutral' | 'Total';
	league_id: string | null;
	league_slug: string | null;
	wins: number;
	games: number;
	losses: number;
	points_diff: number | null;
	attendance: number | null;
	points_scored: number | null;
	points_received: number | null;
	win_percentage: number | null;
}

// A location-keyed team record for one phase.
export interface TeamLocationRecord {
	total: TeamStats | null;
	home: TeamStats | null;
	away: TeamStats | null;
	neutral: TeamStats | null;
}

// Top-level API response
export interface TeamStatsResponse {
	teamId: number;
	teamSlug: string;
	teamName: string;
	total: TeamStats;
	home: TeamStats;
	away: TeamStats;
	neutral: TeamStats;
	stats?: TeamStats[];
	/** Regular-season-only split (stage IN league/group). */
	regular?: TeamLocationRecord | null;
	/** Playoff-only split (stage = playoff). */
	playoff?: TeamLocationRecord | null;
	/** True only when the team has games in both phases for this competition. */
	hasPhaseSplit?: boolean;
}

export interface TeamSeasonStatsResponse {
	teamId: number;
	teamSlug: string;
	teamName: string;
	stats: {
		total: TeamStats;
		home: TeamStats;
		away: TeamStats;
		neutral?: TeamStats;
	};
}

export type TeamStatsRanking = {
	team_id: number;
	team_name: string;
	team_slug: string;
	games: string;
	games_rank: string;
	wins: string;
	wins_rank: string;
	losses: string;
	losses_rank: string;
	win_pct: number;
	points_scored: number;
	points_scored_rank: number;
	points_received: number;
	points_received_rank: number;
	points_diff: number;
	points_diff_rank: number;
	attendance: number;
	attendance_rank: number;
};

export interface TeamPlayerRecord {
	game_id: string;
	player_id: string;
	first_name: string;
	last_name: string;
	season: string;
	stat_value: number;
	image_url: string | null;
}

export interface TeamTeamRecord {
	game_id: string;
	opponent_name: string;
	opponent_slug: string;
	season: string;
	stat_value: number;
}

/** The { total, home, away, neutral } location split returned by the player-section endpoints. */
export interface LocationSplit<T> {
	total: T[];
	home: T[];
	away: T[];
	neutral: T[];
}

/**
 * A single player's aggregated line (total or per-game average — same shape for
 * both) from the League/Season tab player section. Numeric columns arrive as
 * strings from Postgres SUM/ROUND, so values are widened to string | number.
 */
export interface TeamPlayerAggStat {
	player_id: string;
	first_name: string;
	last_name: string;
	is_active_player: boolean;
	games: string | number | null;
	games_started: string | number | null;
	minutes: string | number | null;
	points: string | number | null;
	assists: string | number | null;
	off_rebounds: string | number | null;
	def_rebounds: string | number | null;
	rebounds: string | number | null;
	steals: string | number | null;
	blocks: string | number | null;
	field_goals_made: string | number | null;
	field_goals_attempted: string | number | null;
	field_goal_percentage: string | number | null;
	three_pointers_made: string | number | null;
	three_pointers_attempted: string | number | null;
	three_point_percentage: string | number | null;
	free_throws_made: string | number | null;
	free_throws_attempted: string | number | null;
	free_throw_percentage: string | number | null;
	efficiency: string | number | null;
}

export type TeamPlayerAggStatsResponse = LocationSplit<TeamPlayerAggStat>;
export type TeamPlayerSplitRecordsResponse = LocationSplit<TeamPlayerRecord>;

export interface TeamDirectoryEntry {
	id: number;
	documentId: string;
	name: string;
	alternate_names: AlternateName[];
	short_name: string;
	slug: string;
	logo: StrapiImage;
	nation: string;
	games: string;
	wins: string;
	losses: string;
	win_percentage: string;
	isMainTeam: boolean;
}
