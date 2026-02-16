import { describe, it, expect } from 'vitest';
import { filterSchedule } from '@/context/games-context';

const makeGame = (id: string, league_id: string, home: string, away: string) => ({
	id,
	league_id,
	home_team_name: home,
	away_team_name: away
} as any);

const SAMPLE_SCHEDULE = [
	makeGame('1', 'A', 'KK Zadar', 'Other Club'),
	makeGame('2', 'B', 'Some Team', 'Another Team'),
	makeGame('3', 'A', 'Guest', 'Visitor')
];

describe('filterSchedule', () => {
	it('returns empty array when schedule is falsy or empty', () => {
		expect(filterSchedule([], ['A'], '', false)).toEqual([]);
	});

	it('filters by selected competitions (non-Zadar)', () => {
		const out = filterSchedule(SAMPLE_SCHEDULE, ['A'], '', false);
		expect(out.map((g) => g.id)).toEqual(['1', '3']);
	});

	it('respects searchTerm when isZadar=true', () => {
		// searchGames looks for `home_team_name + ' vs ' + away_team_name` (slugified).
		const out = filterSchedule(SAMPLE_SCHEDULE, ['A', 'B'], 'kk zadar vs other club', true);
		expect(out.map((g) => g.id)).toEqual(['1']);
	});

	it('returns competition-matched games when isZadar=true and no searchTerm', () => {
		const out = filterSchedule(SAMPLE_SCHEDULE, ['A', 'B'], '', true);
		expect(out.map((g) => g.id)).toEqual(['1', '2', '3']);
	});
});
