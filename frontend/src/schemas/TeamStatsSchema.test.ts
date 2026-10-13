import { describe, it, expect } from 'vitest';

import { teamStatsSchema } from './TeamStatsSchema';

const blank = Object.fromEntries(Object.keys(teamStatsSchema.shape).map((k) => [k, ''])) as Record<string, string | null>;

const parse = (overrides: Record<string, string | null>) =>
	teamStatsSchema.safeParse({ ...blank, season: '1985', league: 'x', overtime: null, ...overrides });

const finalScoreIssue = (result: ReturnType<typeof parse>) =>
	!result.success && result.error.issues.find((i) => i.path[0] === 'final_score');

describe('teamStatsSchema period / final score rules', () => {
	it('rejects a row with neither period scores nor a final score', () => {
		expect(finalScoreIssue(parse({}))).toBeTruthy();
	});

	it('accepts a final score alone', () => {
		expect(finalScoreIssue(parse({ final_score: '87' }))).toBeFalsy();
	});

	it('accepts period scores alone', () => {
		expect(finalScoreIssue(parse({ firstQuarter: '20', secondQuarter: '18' }))).toBeFalsy();
	});

	it('rejects a final score that disagrees with the period total', () => {
		expect(finalScoreIssue(parse({ firstHalf: '40', secondHalf: '45', final_score: '90' }))).toBeTruthy();
	});

	it('accepts a final score that matches the period total', () => {
		expect(finalScoreIssue(parse({ firstHalf: '40', secondHalf: '45', final_score: '85' }))).toBeFalsy();
	});
});
