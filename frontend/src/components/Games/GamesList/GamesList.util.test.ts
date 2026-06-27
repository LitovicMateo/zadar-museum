import { describe, expect, it } from 'vitest';

import { TeamScheduleResponse } from '@/types/api/Team';

import { buildScheduleSections, groupByCompetition } from './GamesList.util';

const game = (over: Partial<TeamScheduleResponse>): TeamScheduleResponse => ({
	game_id: 1,
	game_document_id: Math.random().toString(36).slice(2),
	game_date: '2024-01-01',
	season: '2024',
	stage: 'league',
	round: '1',
	league_id: 'L1',
	league_name: 'League One',
	competition_slug: 'league-one',
	home_team_id: 'h',
	home_team_name: 'KK Zadar',
	home_team_short_name: 'ZAD',
	home_team_slug: 'kk-zadar',
	home_score: 80,
	away_team_id: 'a',
	away_team_name: 'Opponent',
	away_team_short_name: 'OPP',
	away_team_slug: 'opponent',
	away_score: 70,
	...over
});

describe('buildScheduleSections', () => {
	it('orders league games by numeric round and labels them', () => {
		const sections = buildScheduleSections([
			game({ stage: 'league', round: '3' }),
			game({ stage: 'league', round: '1' }),
			game({ stage: 'league', round: '2' })
		]);
		expect(sections).toHaveLength(1);
		expect(sections[0].kind).toBe('league');
		expect(sections[0].items.map((i) => i.roundLabel)).toEqual(['Round 1', 'Round 2', 'Round 3']);
	});

	it('creates a section per group with a "Group X" heading', () => {
		const sections = buildScheduleSections([
			game({ stage: 'group', group_name: 'B', round: '1', game_date: '2024-02-01' }),
			game({ stage: 'group', group_name: 'A', round: '1', game_date: '2024-01-01' })
		]);
		expect(sections.map((s) => s.heading)).toEqual(['Group A', 'Group B']);
		expect(sections.every((s) => s.kind === 'group')).toBe(true);
	});

	it('labels a single knockout game with no per-game label but a stage heading', () => {
		const sections = buildScheduleSections([game({ stage: 'playoff', round: 'F' })]);
		expect(sections).toHaveLength(1);
		expect(sections[0].heading).toBe('Final');
		expect(sections[0].items[0].roundLabel).toBe('');
	});

	it('labels a multi-game playoff stage as a date-ordered series', () => {
		const sections = buildScheduleSections([
			game({ stage: 'playoff', round: 'QF', game_date: '2024-05-10' }),
			game({ stage: 'playoff', round: 'QF', game_date: '2024-05-03' }),
			game({ stage: 'playoff', round: 'QF', game_date: '2024-05-07' })
		]);
		expect(sections[0].heading).toBe('Quarter-finals');
		expect(sections[0].items.map((i) => i.roundLabel)).toEqual(['Game 1', 'Game 2', 'Game 3']);
		expect(sections[0].items.map((i) => i.game.game_date)).toEqual([
			'2024-05-03',
			'2024-05-07',
			'2024-05-10'
		]);
	});

	it('orders sections league -> group -> playoff', () => {
		const sections = buildScheduleSections([
			game({ stage: 'playoff', round: 'SF' }),
			game({ stage: 'group', group_name: 'A' }),
			game({ stage: 'league', round: '1' })
		]);
		expect(sections.map((s) => s.kind)).toEqual(['league', 'group', 'playoff']);
	});

	it('orders playoff stages by seeding (QF before SF before F)', () => {
		const sections = buildScheduleSections([
			game({ stage: 'playoff', round: 'F' }),
			game({ stage: 'playoff', round: 'QF' }),
			game({ stage: 'playoff', round: 'SF' })
		]);
		expect(sections.map((s) => s.heading)).toEqual(['Quarter-finals', 'Semi-finals', 'Final']);
	});
});

describe('groupByCompetition', () => {
	it('groups games by league and builds each competition\'s sections', () => {
		const groups = groupByCompetition([
			game({ league_id: 'L1', league_name: 'League One', stage: 'league', round: '1' }),
			game({ league_id: 'L2', league_name: 'Cup', stage: 'playoff', round: 'F' })
		]);
		expect(groups).toHaveLength(2);
		const cup = groups.find((g) => g.leagueId === 'L2');
		expect(cup?.leagueName).toBe('Cup');
		expect(cup?.sections[0].kind).toBe('playoff');
	});
});
