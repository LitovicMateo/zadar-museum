import { describe, expect, it } from 'vitest';

import { buildPhaseGroups } from './buildPhaseGroups';

type Row = { league_slug: string; games: number };
type Entry = {
	combined: Row | null;
	regular: Row | null;
	playoff: Row | null;
	split: boolean;
};

const accessors = {
	combined: (e: Entry) => e.combined,
	regular: (e: Entry) => e.regular,
	playoff: (e: Entry) => e.playoff,
	split: (e: Entry) => e.split,
	keyOf: (r: Row) => r.league_slug,
	heading: (r: Row) => r.league_slug,
};

describe('buildPhaseGroups', () => {
	it('emits a single row (no heading) when the entry does not qualify for a split', () => {
		const entry: Entry = {
			combined: { league_slug: 'cup', games: 4 },
			regular: null,
			playoff: { league_slug: 'cup', games: 4 },
			split: false,
		};
		const groups = buildPhaseGroups<Entry, Row>([entry], accessors);
		expect(groups).toHaveLength(1);
		expect(groups[0].heading).toBeUndefined();
		expect(groups[0].rows).toHaveLength(1);
	});

	it('puts total stats on the competition row with indented Regular Season / Playoff sub-rows', () => {
		const entry: Entry = {
			combined: { league_slug: 'league', games: 30 },
			regular: { league_slug: 'league', games: 22 },
			playoff: { league_slug: 'league', games: 8 },
			split: true,
		};
		const groups = buildPhaseGroups<Entry, Row>([entry], accessors);
		expect(groups[0].heading).toBeUndefined();
		// First row carries the total stats and no phase label (competition name comes from the column cell).
		expect(groups[0].rows[0].label).toBeUndefined();
		expect(groups[0].rows[0].data.games).toBe(30);
		expect(groups[0].rows.map((r) => r.label)).toEqual([undefined, 'Regular Season', 'Playoff']);
		expect(groups[0].rows[1].indent).toBe(true);
		expect(groups[0].rows[2].indent).toBe(true);
	});

	it('falls back to a single row when split is flagged but a phase row is missing', () => {
		const entry: Entry = {
			combined: { league_slug: 'league', games: 22 },
			regular: { league_slug: 'league', games: 22 },
			playoff: null,
			split: true,
		};
		const groups = buildPhaseGroups<Entry, Row>([entry], accessors);
		expect(groups[0].rows).toHaveLength(1);
		expect(groups[0].heading).toBeUndefined();
	});

	it('skips entries with no combined row', () => {
		const entry: Entry = { combined: null, regular: null, playoff: null, split: false };
		expect(buildPhaseGroups<Entry, Row>([entry], accessors)).toHaveLength(0);
	});
});
