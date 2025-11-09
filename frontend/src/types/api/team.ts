import { StrapiImage } from './strapi';

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
}

export type TeamSeasonsResponse = string[];

export interface TeamHeadToHeadResposne {
	opponent_id: number;
	opponent_name: string;
	opponent_slug: string;
	games_played: number;
	zadar_wins: number;
	opponent_wins: number;
	zadar_win_percentage: number;
	opponent_win_percentage: number;
}

export interface TeamScheduleResponse {
	game_id: number;
	game_document_id: string;
	game_date: string; // ISO date string
	season: string;
	stage: string;
	round: string;

	league_id: string;
	league_name: string;
	competition_slug: string;

	home_team_id: string;
	home_team_name: string;
	home_team_short_name: string;
	home_score: number | null;

	away_team_id: string;
	away_team_name: string;
	away_team_short_name: string;
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
	key: 'Home' | 'Away' | 'Total';
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

// Top-level API response
export interface TeamStatsResponse {
	teamId: number;
	teamSlug: string;
	teamName: string;
	total: TeamStats;
	home: TeamStats;
	away: TeamStats;
	stats: TeamStats[];
}

export interface TeamSeasonStatsResponse {
	teamId: number;
	teamSlug: string;
	teamName: string;
	stats: {
		total: TeamStats;
		home: TeamStats;
		away: TeamStats;
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
