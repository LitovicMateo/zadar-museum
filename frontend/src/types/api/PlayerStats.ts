import { CompetitionDetailsResponse } from './Competition';
import { GameDetailsResponse } from './Game';
import { PlayerBoxscoreResponse, PlayerResponse } from './Player';
import { TeamDetailsResponse } from './Team';

/**
 * A game-less "aggregate line" (historic season/tournament summary). Unlike
 * PlayerStatsResponse there is no game; season + competition + gamesPlayed are
 * stored directly on the row. All stat fields are optional (only what's known).
 */
export type AggregatePlayerStatResponse = {
	id: number;
	documentId: string;
	season: string;
	gamesPlayed: number | null;
	competition: CompetitionDetailsResponse | null;
	team: TeamDetailsResponse;
	player: PlayerResponse;
	status: 'starter' | 'bench' | 'dnp-cd' | 'no-data';
	points: number | null;
	fieldGoalsMade: number | null;
	fieldGoalsAttempted: number | null;
	threePointersMade: number | null;
	threePointersAttempted: number | null;
	freeThrowsMade: number | null;
	freeThrowsAttempted: number | null;
	rebounds: number | null;
	offensiveRebounds: number | null;
	defensiveRebounds: number | null;
	assists: number | null;
	steals: number | null;
	blocks: number | null;
	turnovers: number | null;
	fouls: number | null;
	foulsOn: number | null;
	blocksReceived: number | null;
	plusMinus: number | null;
	efficiency: number | null;
};

export type PlayerStatsResponse = {
	id: number;
	documentId: string;
	game: GameDetailsResponse;
	team: TeamDetailsResponse;
	player: PlayerResponse;
	status: 'starter' | 'bench' | 'dnp-cd';
	playerNumber: string;
	isCaptain: boolean;
	minutes: string;
	seconds: string;
	points: string;
	fieldGoalsMade: string;
	fieldGoalsAttempted: string;
	threePointersMade: string;
	threePointersAttempted: string;
	freeThrowsMade: string;
	freeThrowsAttempted: string;
	rebounds: string;
	offensiveRebounds: string;
	defensiveRebounds: string;
	assists: string;
	steals: string;
	blocks: string;
	turnovers: string;
	fouls: string;
	foulsOn: string;
	blocksReceived: string;
	plusMinus: string;
	efficiency: string;
	createdAt: string;
};

export type PlayerStatRankings = {
	points_rank: number;
	steals_rank: number;
	assists_rank: number;
	rebounds_rank: number;
	offensive_rebounds_rank: number;
	defensive_rebounds_rank: number;
	blocks_rank: number;
	turnovers_rank: number;
	fouls_rank: number;
	fouls_on_rank: number;
	blocks_received_rank: number;
	plus_minus_rank: number;
	efficiency_rank: number;
	def_rebounds_rank: number;
	off_rebounds_rank: number;
	field_goals_made_rank: number;
	field_goals_attempted_rank: number;
	three_pointers_made_rank: number;
	three_pointers_attempted_rank: number;
	free_throws_made_rank: number;
	free_throws_attempted_rank: number;
};

export type PlayerRecords = PlayerBoxscoreResponse & PlayerStatRankings;

export type PlayerStatsFormData = {
	gameId: number;
	teamId: number;
	playerId: number;
	status: 'starter' | 'bench' | 'dnp-cd';
	isCaptain: boolean;
	playerNumber: string;
	minutes: string;
	seconds: string;
	points: string;
	fieldGoalsMade: string;
	fieldGoalsAttempted: string;
	threePointersMade: string;
	threePointersAttempted: string;
	freeThrowsMade: string;
	freeThrowsAttempted: string;
	rebounds: string;
	offensiveRebounds: string;
	defensiveRebounds: string;
	assists: string;
	steals: string;
	blocks: string;
	turnovers: string;
	fouls: string;
	foulsOn: string;
	blocksReceived: string;
	plusMinus: string;
	efficiency: string;
};
