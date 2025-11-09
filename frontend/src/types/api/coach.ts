export type CoachFormData = {
	first_name: string;
	last_name: string;
	date_of_birth: Date | null;
	image: File | null;
	nationality: string;
};

export interface CoachDetailsResponse {
	id: number;
	first_name: string;
	last_name: string;
	date_of_birth?: string | null;
	image: string;
	nationality: string;
	createdAt: string;
	documentId: string;
}

export type CoachRecordRow = {
	name: string; // e.g., "Total", "Home", "Away"
	games: number;
	wins: number;
	losses: number;
	winPercentage: number;
	pointsScored: number;
	pointsReceived: number;
	pointsDiff: number;
};

export type CoachRecordResponse = {
	coachId: string;
	firstName: string;
	lastName: string;
	allTime: CoachRecordRow[];
	headCoach: CoachRecordRow[];
	assistantCoach: CoachRecordRow[];
};

export interface CoachLeagueStatsResponse {
	coach_id: string;
	first_name: string;
	last_name: string;
	league_slug: string;
	league_name: string;
	total_games: string;
	total_wins: string;
	total_losses: string;
	total_win_pct: number;
	points_scored: number;
	points_received: number;
	pts_diff: number;
	games_head: string;
	wins_head: string;
	losses_head: string;
	win_pct_head: number;
	pts_scored_head: number;
	pts_received_head: number;
	diff_head: number;
	games_assistant: string;
	wins_assistant: string;
	losses_assistant: string;
	win_pct_assistant: number | null;
	pts_scored_assistant: number | null;
	pts_received_assistant: number | null;
	diff_assistant: number | null;
}

// Common stats for a specific context (home, away, total)
export interface CoachStats {
	wins: number | null;
	games: number | null;
	losses: number | null;
	league_id: string | null;
	league_slug: string | null;
	win_percentage: number | null;
	points_scored: number | null;
	points_received: number | null;
	points_difference: number | null;
}

// Generic container for home/away/total stats
export interface CoachStatsGroup {
	away: CoachStats;
	home: CoachStats;
	total: CoachStats;
}

// Top-level API response
export interface CoachStatsResponse {
	coachId: string;
	firstName: string;
	lastName: string;
	season?: string;
	total: CoachStatsGroup;
	headCoach: CoachStatsGroup;
	assistantCoach: CoachStatsGroup;
}

export type CoachStatsRanking = {
	coach_id: string;
	first_name: string;
	last_name: string;
	games: number;
	games_rank: number;
	wins: number;
	wins_rank: number;
	losses: number;
	losses_rank: number;
	win_percentage: number;
	points_scored: number;
	points_scored_rank: number;
	points_received: number;
	points_received_rank: number;
	points_difference: number;
	points_difference_rank: number;
};
