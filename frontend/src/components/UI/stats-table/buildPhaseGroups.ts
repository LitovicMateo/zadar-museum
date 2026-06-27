import type { ReactNode } from 'react';

import type { StatsGroup } from './types';

const PHASE_LABEL = {
	regular: 'Regular Season',
	playoff: 'Playoff',
} as const;

interface Accessors<E, R> {
	/** The combined (all-phase) stat row for an entry. Entry is skipped if null. */
	combined: (entry: E) => R | null | undefined;
	/** The regular-season stat row, or null when absent. */
	regular: (entry: E) => R | null | undefined;
	/** The playoff stat row, or null when absent. */
	playoff: (entry: E) => R | null | undefined;
	/** Whether this entry qualifies for the split (both phases present). */
	split: (entry: E) => boolean;
	/** Stable React key for a row. */
	keyOf: (row: R) => string;
	/** @deprecated No longer used — the competition row now carries the total stats. */
	heading?: (row: R) => ReactNode;
}

/**
 * Turns a list of phase-aware entries into {@link StatsGroup}s for
 * {@link StatsTable}. An entry that qualifies for the split (both phases present
 * at the active scope) renders the combined/total stats on the competition row
 * itself, with indented Regular Season / Playoff sub-rows beneath it; otherwise
 * it stays a single row.
 *
 * The split only renders when the regular and playoff rows are both available
 * for the current view/location — guarding against an empty sub-row when a
 * location filter leaves only one phase.
 */
export function buildPhaseGroups<E, R>(entries: E[] | undefined, a: Accessors<E, R>): StatsGroup<R>[] {
	if (!entries) return [];
	const groups: StatsGroup<R>[] = [];

	for (const entry of entries) {
		const combined = a.combined(entry);
		if (!combined) continue;

		const regular = a.regular(entry);
		const playoff = a.playoff(entry);
		const key = a.keyOf(combined);

		if (a.split(entry) && regular && playoff) {
			groups.push({
				key,
				sortData: combined,
				rows: [
					// Competition row: name (from the column's own cell) + total stats.
					{ key, data: combined },
					{ key: `${key}:regular`, data: regular, label: PHASE_LABEL.regular, indent: true },
					{ key: `${key}:playoff`, data: playoff, label: PHASE_LABEL.playoff, indent: true },
				],
			});
		} else {
			groups.push({ key, rows: [{ key, data: combined }] });
		}
	}

	return groups;
}
