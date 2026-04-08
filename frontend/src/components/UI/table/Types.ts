import { RowData } from '@tanstack/react-table';

/**
 * Per-column layout metadata attached to TanStack's ColumnDef.meta.
 * Controls sticky pinning, width, alignment, and group-separator borders.
 */
export interface TableColumnMeta {
	/** Freeze this column to the left edge of the table scroll container. */
	sticky?: 'left';
	/**
	 * CSS `left` value used when `sticky === 'left'` (e.g. '0px', '40px', '4ch').
	 * Defaults to '0' when not provided.
	 */
	stickyOffset?: string;
	/** Additional Tailwind width class applied to the th/td (e.g. 'w-[200px]'). */
	width?: string;
	/**
	 * Text alignment. Sticky columns default to 'left'; all others default to 'center'.
	 * Override here when needed.
	 */
	align?: 'left' | 'center';
	/**
	 * When true, adds a right border (`border-r border-slate-400`) to visually
	 * separate TanStack column groups from each other.
	 */
	isLastInGroup?: boolean;
}

// ─── Module augmentation ──────────────────────────────────────────────────────
// Merges TableColumnMeta into every ColumnDef's `meta` object.
declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> extends TableColumnMeta {}
}
