import type { ReactNode } from 'react';

import type { TableColumnMeta } from '@/components/UI/table/Types';

export type FooterVariant = 'default' | 'gradient' | 'light';

/**
 * Declarative column definition for {@link StatsTable}. Replaces the
 * `@tanstack/react-table` ColumnDef for migrated stats tables.
 *
 * - `cell` renders the body content for a row.
 * - `sortValue` makes the column sortable; omit it for a non-sortable column.
 * - `meta` carries the same sticky/align/width/group-border semantics as the
 *   legacy {@link TableColumnMeta}.
 */
export interface StatsColumn<T> {
	id: string;
	header: ReactNode;
	cell: (row: T) => ReactNode;
	sortValue?: (row: T) => number | string | null | undefined;
	sortDescFirst?: boolean;
	meta?: TableColumnMeta;
}

/** A single rendered data row. */
export interface StatsDataRow<T> {
	key: string;
	data: T;
	/**
	 * Overrides the first column's rendered content — used to show the phase
	 * label ("Regular Season" / "Playoff" / "Total") on split sub-rows.
	 */
	label?: ReactNode;
	/** Indents the first-column label (regular-season / playoff sub-rows). */
	indent?: boolean;
	/** Subtotal treatment for the combined "Total" sub-row. */
	emphasize?: boolean;
	/** CSS-module class for body row variants (e.g. starter / active). */
	rowClass?: string;
}

/**
 * A competition (+season) group. A group with a single row renders as one plain
 * row; a group with a heading + multiple rows renders the regular/playoff/total
 * stacked sub-rows.
 */
export interface StatsGroup<T> {
	key: string;
	/** Optional full-width heading row (competition name) shown above the rows. */
	heading?: ReactNode;
	rows: StatsDataRow<T>[];
	/** Row values that drive sorting for the whole group. Defaults to rows[0].data. */
	sortData?: T;
}

export interface SortState {
	columnId: string;
	dir: 'asc' | 'desc';
}
