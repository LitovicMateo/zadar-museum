// API response

export type RefereeFormData = {
	first_name: string;
	last_name: string;
	nationality?: string | null;
};

export interface RefereeDetailsResponse {
	id: number;
	first_name: string;
	last_name: string;
	nationality?: string | null;
	createdAt: string;
	documentId: string;
}

export interface RefereeStatsResponse {
	referee_id: string;
	first_name: string;
	last_name: string;
	stats: RefereeStats[];
}

export interface RefereSeasonStatsResponse {
	referee_id: string;
	first_name: string;
	last_name: string;
	league_id: string;
	league_slug: string;
	season: string;
	stats: {
		total: RefereeStats;
		home: RefereeStats;
		away: RefereeStats;
	};
}

export type RefereeStats = {
	key?: string;
	league_id?: string;
	league_slug?: string;
	games: number | null;
	wins: number | null;
	losses: number | null;
	win_percentage: number | null;
	fouls_for: number | null;
	fouls_against: number | null;
	foul_difference: number | null;
};

export type RefereeStatsRanking = {
	referee_id: number;
	referee_document_id: string;
	first_name: string;
	last_name: string;
	games: string;
	games_rank: string;
	wins: string;
	wins_rank: string;
	losses: string;
	losses_rank: string;
	win_percentage: number;
	fouls_for: number;
	fouls_for_rank: number;
	fouls_against: number;
	fouls_against_rank: number;
	foul_difference: number;
	foul_difference_rank: number;
};
