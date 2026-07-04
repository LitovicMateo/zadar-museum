import { describe, it, expect } from 'vitest';
import { buildPlayerStatsDefaults } from './buildPlayerStatsDefaults';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';

// Stat fields are typed as string but the API can serialize them as numbers;
// the builder must string-convert them so z.string() validation passes on edit.
const mockPlayerStat = {
	id: 1,
	documentId: 'doc-1',
	game: { id: 10, season: '2019', competition: { documentId: 'comp-1' } },
	team: { id: 20 },
	player: { id: 30 },
	status: 'starter',
	isCaptain: false,
	playerNumber: 7,
	minutes: 30,
	seconds: 12,
	points: 20,
	fieldGoalsMade: 8,
	fieldGoalsAttempted: 15,
	threePointersMade: 2,
	threePointersAttempted: 5,
	freeThrowsMade: 2,
	freeThrowsAttempted: 3,
	rebounds: 6,
	offensiveRebounds: null,
	defensiveRebounds: null,
	assists: 4,
	steals: 1,
	blocks: 0,
	turnovers: 3,
	fouls: 2,
	foulsOn: 1,
	blocksReceived: 0,
	plusMinus: 5,
	efficiency: 22
} as unknown as PlayerStatsResponse;

describe('buildPlayerStatsDefaults', () => {
	it('populates season and league (regression: were omitted from the edit reset)', () => {
		const result = buildPlayerStatsDefaults(mockPlayerStat);
		expect(result.season).toBe('2019');
		expect(result.league).toBe('comp-1');
	});

	it('string-converts every stat field so z.string() validation passes', () => {
		const result = buildPlayerStatsDefaults(mockPlayerStat);
		expect(result.points).toBe('20');
		expect(result.rebounds).toBe('6');
		expect(typeof result.points).toBe('string');
		expect(typeof result.assists).toBe('string');
		expect(result.gameId).toBe('10');
		expect(result.teamId).toBe('20');
		expect(result.playerId).toBe('30');
	});

	it('blanks stat fields for a DNP record', () => {
		const dnp = { ...mockPlayerStat, status: 'dnp-cd' } as unknown as PlayerStatsResponse;
		const result = buildPlayerStatsDefaults(dnp);
		expect(result.points).toBe('');
		expect(result.minutes).toBe('');
	});
});
