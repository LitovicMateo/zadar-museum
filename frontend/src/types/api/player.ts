import { StrapiImage } from './strapi';

export type PlayerFormData = {
	first_name: string;
	last_name: string;
	nationality?: string | null;
	height?: string;
	date_of_birth?: string;
	date_of_death?: string;
	isActivePlayer: boolean;
	primary_position?: string | null;
	secondary_position?: string | null;
	image: File | null;
};

export type PlayerResponse = {
	id: number;
	documentId: string;
	first_name: string;
	last_name: string;
	date_of_birth: string; // ISO 8601 date
	date_of_death: string; // ISO 8601 date
	isActivePlayer: boolean;
	primary_position: string; // e.g. "pg"
	secondary_position: string | null; // e.g. "sg"
	nationality?: string | null; // ISO country code like "ME"
	height?: string; // three-digit string (e.g. "185")
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	image: StrapiImage;
};

export interface PlayerNumberResponse {
	playerId: string;
	mostFrequentNumber: string;
}

export interface PlayerCompetitionResponse {
	league_name: string;
	league_id: string;
	league_slug: string;
}

export type PlayerSeasonsResponse = string[];

export interface PlayerTeamResponse {
	team_name: string;
	team_slug: string;
}

export interface PlayerAllTimeStats {
	player_id: string;
	first_name: string;
	last_name: string;

	league_id: string;
	league_name: string;
	league_slug: string;

	games: number;
	games_started: number;
	games_rank: number;

	points: number;
	points_rank: number;

	assists: number;
	assists_rank: number;

	off_rebounds: number;
	off_rebounds_rank: number;

	def_rebounds: number;
	def_rebounds_rank: number;

	rebounds: number;
	rebounds_rank: number;

	steals: number;
	steals_rank: number;

	blocks: number;
	blocks_rank: number;

	field_goals_made: number;
	field_goals_made_rank: number;

	field_goals_attempted: number;
	field_goals_attempted_rank: number;

	three_pointers_made: number;
	three_pointers_made_rank: number;

	three_pointers_attempted: number;
	three_pointers_attempted_rank: number;

	free_throws_made: number;
	free_throws_made_rank: number;

	free_throws_attempted: number;
	free_throws_attempted_rank: number;

	efficiency: number;
	efficiency_rank: number;
}

export interface PlayerBoxscoreResponse {
	id: number;
	document_id: string;
	game_id: string;
	player_id: string;
	captain: boolean;

	player_team_document_id: string;
	team_name: string;
	team_short_name: string;

	opponent_team_id: number;
	opponent_team_document_id: string;
	opponent_team_short_name: string;
	opponent_team_slug: string;

	season: string;
	league_id: string;
	league_name: string;
	league_slug?: string;
	league_short_name?: string;

	is_home_team: boolean;
	game_date: string; // ISO date string

	first_name: string;
	last_name: string;
	age_decimal: number | null;
	position: string;
	secondary_position: string | null;
	shirt_number: number | null;

	status: string;

	minutes: number | null;
	seconds: number | null;
	points: number | null;

	field_goals_made: number | null;
	field_goals_attempted: number | null;
	field_goals_percentage: number | null;

	three_pointers_made: number | null;
	three_pointers_attempted: number | null;
	three_point_percentage: number | null;

	free_throws_made: number | null;
	free_throws_attempted: number | null;
	free_throws_percentage: number | null;

	rebounds: number | null;
	offensive_rebounds: number | null;
	defensive_rebounds: number | null;

	assists: number | null;
	steals: number | null;
	blocks: number | null;

	turnovers: number | null;
	fouls: number | null;
	fouls_on: number | null;

	blocks_received: number | null;
	plus_minus: number | null;
	efficiency: number | null;
}

export interface PlayerAllTimeCareerResponse {
	player_id: string;
	avg_career_stats: PlayerAllTimeStats[];
	total_career_stats: PlayerAllTimeStats[];
}

export interface PlayerAllTimeLeagueResponse {
	player_id: string;
	avg_league_stats: PlayerAllTimeStats[];
	total_league_stats: PlayerAllTimeStats[];
}

export type Stat = {
	game_date: string;
	game_id: string;
	opponent_team_name: string;
	opponent_team_slug: string;
	stat_value: number;
};

export interface PlayerCareerHighResponse {
	playerId: string;
	points: Stat;
	rebounds: Stat;
	assists: Stat;
	steals: Stat;
	blocks: Stat;
	field_goals_made: Stat;
	three_pointers_made: Stat;
	free_throws_made: Stat;
	efficiency: Stat;
}

export interface PlayerCareerStats {
	player_id: string;
	first_name: string;
	last_name: string;
	total: {
		total: GameStatsEntry;
		home: GameStatsEntry;
		away: GameStatsEntry;
	};
	average: {
		total: GameStatsEntry;
		home: GameStatsEntry;
		away: GameStatsEntry;
	};
}

/**
 * A single stat entry (home / away / total) with a key identifier.
 */
export interface GameStatsEntry extends GameStats {
	key: 'home' | 'away' | 'total';
}

/**
 * Rank-related statistics.
 */
export interface GameRanks {
	league_id?: string;
	league_slug?: string;
	games_rank: number | null;
	blocks_rank: number | null;
	points_rank: number | null;
	steals_rank: number | null;
	assists_rank: number | null;
	rebounds_rank: number | null;
	efficiency_rank: number | null;
	def_rebounds_rank: number | null;
	off_rebounds_rank: number | null;
	field_goals_made_rank: number | null;
	free_throws_made_rank: number | null;
	three_pointers_made_rank: number | null;
	field_goal_percentage_rank: number | null;
	field_goals_attempted_rank: number | null;
	free_throw_percentage_rank: number | null;
	free_throws_attempted_rank: number | null;
	three_point_percentage_rank: number | null;
	three_pointers_attempted_rank: number | null;
}

/**
 * Core game averages and totals.
 */
export interface GameAverages {
	games: number | null;
	blocks: number | null;
	points: number | null;
	steals: number | null;
	assists: number | null;
	minutes: number | null;
	rebounds: number | null;
	efficiency: number | null;
	def_rebounds: number | null;
	off_rebounds: number | null;
	games_started: number | null;
	field_goals_made: number | null;
	free_throws_made: number | null;
	three_pointers_made: number | null;
	field_goal_percentage: number | null;
	field_goals_attempted: number | null;
	free_throw_percentage: number | null;
	free_throws_attempted: number | null;
	three_point_percentage: number | null;
	three_pointers_attempted: number | null;
}

/**
 * GameStats = GameAverages + GameRanks
 */
export type GameStats = GameAverages & GameRanks;
