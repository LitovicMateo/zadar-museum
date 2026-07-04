import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

/**
 * Builds the react-hook-form default values for the player-stats form from a
 * loaded record. Shared by PlayerStatsFormPage (initial mount) and
 * PlayerStatsFormProvider (async reset) so the two never drift.
 */
export const buildPlayerStatsDefaults = (playerStat: PlayerStatsResponse): PlayerStatsFormData => {
	const isDnp = playerStat.status === 'dnp-cd';
	const hasOffAndDef =
		playerStat.offensiveRebounds !== null &&
		playerStat.offensiveRebounds !== undefined &&
		playerStat.defensiveRebounds !== null &&
		playerStat.defensiveRebounds !== undefined;

	return {
		season: playerStat.game?.season ?? '',
		league: playerStat.game?.competition?.documentId ?? '',
		gameId: playerStat.game?.id?.toString() ?? '',
		teamId: playerStat.team?.id?.toString() ?? '',
		playerId: playerStat.player?.id?.toString() ?? '',
		status: playerStat.status,
		isCaptain: playerStat.isCaptain,
		playerNumber: isDnp ? '' : toStr(playerStat.playerNumber),
		minutes: isDnp ? '' : toStr(playerStat.minutes),
		seconds: isDnp ? '' : toStr(playerStat.seconds),
		points: isDnp ? '' : toStr(playerStat.points),
		fieldGoalsMade: isDnp ? '' : toStr(playerStat.fieldGoalsMade),
		fieldGoalsAttempted: isDnp ? '' : toStr(playerStat.fieldGoalsAttempted),
		threePointersMade: isDnp ? '' : toStr(playerStat.threePointersMade),
		threePointersAttempted: isDnp ? '' : toStr(playerStat.threePointersAttempted),
		freeThrowsMade: isDnp ? '' : toStr(playerStat.freeThrowsMade),
		freeThrowsAttempted: isDnp ? '' : toStr(playerStat.freeThrowsAttempted),
		rebounds: isDnp ? '' : hasOffAndDef ? '' : toStr(playerStat.rebounds),
		offensiveRebounds: isDnp ? '' : toStr(playerStat.offensiveRebounds),
		defensiveRebounds: isDnp ? '' : toStr(playerStat.defensiveRebounds),
		assists: isDnp ? '' : toStr(playerStat.assists),
		steals: isDnp ? '' : toStr(playerStat.steals),
		blocks: isDnp ? '' : toStr(playerStat.blocks),
		turnovers: isDnp ? '' : toStr(playerStat.turnovers),
		fouls: isDnp ? '' : toStr(playerStat.fouls),
		foulsOn: isDnp ? '' : toStr(playerStat.foulsOn),
		blocksReceived: isDnp ? '' : toStr(playerStat.blocksReceived),
		plusMinus: isDnp ? '' : toStr(playerStat.plusMinus),
		efficiency: isDnp ? '' : toStr(playerStat.efficiency)
	};
};
