import { describe, it, expect } from 'vitest';

import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';

import { buildPeriodScores } from './PeriodScores';

const form = (overrides: Partial<TeamStatsFormData>) =>
	({
		firstQuarter: '',
		secondQuarter: '',
		thirdQuarter: '',
		fourthQuarter: '',
		firstHalf: '',
		secondHalf: '',
		overtime: '',
		...overrides
	}) as TeamStatsFormData;

describe('buildPeriodScores', () => {
	it('sends blank period fields as null, never 0', () => {
		// Regression: `+''` is 0, which is how half-era games ended up with
		// third/fourth quarter = 0 and became indistinguishable from quarter games.
		const result = buildPeriodScores(form({ firstQuarter: '20', secondQuarter: '18' }));

		expect(result.firstQuarter).toBe(20);
		expect(result.secondQuarter).toBe(18);
		expect(result.thirdQuarter).toBeNull();
		expect(result.fourthQuarter).toBeNull();
		expect(result.overtime).toBeNull();
	});

	it('nulls the quarter family when halves were entered', () => {
		const result = buildPeriodScores(form({ firstHalf: '31', secondHalf: '28' }));

		expect(result.firstHalf).toBe(31);
		expect(result.secondHalf).toBe(28);
		expect(result.firstQuarter).toBeNull();
		expect(result.fourthQuarter).toBeNull();
	});

	it('nulls the half family when quarters were entered', () => {
		const result = buildPeriodScores(
			form({ firstQuarter: '19', secondQuarter: '27', thirdQuarter: '20', fourthQuarter: '22' })
		);

		expect(result.firstHalf).toBeNull();
		expect(result.secondHalf).toBeNull();
	});

	it('preserves a genuine 0 and tolerates whitespace-only input', () => {
		const result = buildPeriodScores(form({ firstQuarter: '0', overtime: '   ' }));

		expect(result.firstQuarter).toBe(0);
		expect(result.overtime).toBeNull();
	});
});
