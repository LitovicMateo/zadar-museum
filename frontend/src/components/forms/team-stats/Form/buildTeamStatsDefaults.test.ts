import { describe, it, expect } from 'vitest';
import { buildTeamStatsDefaults } from './buildTeamStatsDefaults';
import { TeamStatsResponse } from '@/types/api/TeamStats';

const baseTeamStat = {
	id: 1,
	documentId: 'doc-1',
	game: { id: 10, season: '2019', competition: { documentId: 'comp-1' } },
	team: { id: 20 },
	coach: { id: 40 },
	assistantCoach: { id: 41 },
	firstQuarter: 20,
	secondQuarter: 18,
	thirdQuarter: 22,
	fourthQuarter: 25,
	overtime: null,
	fieldGoalsMade: 30,
	fieldGoalsAttempted: 60,
	threePointersMade: 8,
	threePointersAttempted: 20,
	freeThrowsMade: 15,
	freeThrowsAttempted: 20,
	rebounds: 40,
	offensiveRebounds: 12,
	defensiveRebounds: 28,
	assists: 18,
	steals: 6,
	blocks: 3,
	turnovers: 14,
	fouls: 19,
	secondChancePoints: 10,
	fastBreakPoints: 12,
	pointsOffTurnovers: 15,
	benchPoints: 22,
	pointsInPaint: 30
} as unknown as TeamStatsResponse;

describe('buildTeamStatsDefaults', () => {
	it('maps league from competition documentId and string-converts stats', () => {
		const result = buildTeamStatsDefaults(baseTeamStat);
		expect(result.league).toBe('comp-1');
		expect(result.season).toBe('2019');
		expect(result.coachId).toBe('40');
		expect(result.assistantCoachId).toBe('41');
		expect(result.firstQuarter).toBe('20');
		expect(typeof result.rebounds).toBe('string');
	});

	it('does not throw when coach/assistantCoach/competition are null', () => {
		const sparse = {
			...baseTeamStat,
			coach: null,
			assistantCoach: null,
			game: { id: 10, season: '2019', competition: null }
		} as unknown as TeamStatsResponse;

		expect(() => buildTeamStatsDefaults(sparse)).not.toThrow();
		const result = buildTeamStatsDefaults(sparse);
		expect(result.coachId).toBe('');
		expect(result.assistantCoachId).toBe('');
		expect(result.league).toBe('');
	});
});
