import { useMemo, useState } from 'react';

import type { SortState, StatsColumn, StatsGroup } from './types';

/**
 * Group-level sorting for {@link StatsTable}. Replaces TanStack's
 * `getSortedRowModel`. Groups are reordered by the active column's value (read
 * from `group.sortData`, falling back to the first row), keeping each group's
 * stacked sub-rows together. When no sort is active, the input order is kept.
 */
export function useStatsSort<T>(
	columns: StatsColumn<T>[],
	groups: StatsGroup<T>[],
	initialSort?: SortState,
) {
	const [sort, setSort] = useState<SortState | undefined>(initialSort);

	const toggleSort = (columnId: string) => {
		const col = columns.find((c) => c.id === columnId);
		if (!col?.sortValue) return;
		setSort((prev) => {
			if (prev?.columnId !== columnId) {
				return { columnId, dir: col.sortDescFirst ? 'desc' : 'asc' };
			}
			return { columnId, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
		});
	};

	const sortedGroups = useMemo(() => {
		if (!sort) return groups;
		const col = columns.find((c) => c.id === sort.columnId);
		if (!col?.sortValue) return groups;
		const getVal = col.sortValue;

		const valueOf = (g: StatsGroup<T>) => {
			const row = g.sortData ?? g.rows[0]?.data;
			return row != null ? getVal(row) : null;
		};

		const factor = sort.dir === 'asc' ? 1 : -1;
		// Stable sort: decorate with original index.
		return groups
			.map((g, i) => ({ g, i }))
			.sort((a, b) => {
				const va = valueOf(a.g);
				const vb = valueOf(b.g);
				// Nulls always sort last regardless of direction.
				if (va == null && vb == null) return a.i - b.i;
				if (va == null) return 1;
				if (vb == null) return -1;
				if (typeof va === 'number' && typeof vb === 'number') {
					if (va === vb) return a.i - b.i;
					return (va - vb) * factor;
				}
				const cmp = String(va).localeCompare(String(vb));
				if (cmp === 0) return a.i - b.i;
				return cmp * factor;
			})
			.map((x) => x.g);
	}, [columns, groups, sort]);

	return { sort, toggleSort, sortedGroups };
}
