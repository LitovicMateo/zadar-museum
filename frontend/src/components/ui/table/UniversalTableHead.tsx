import { flexRender, Table } from '@tanstack/react-table';

import './types';
import styles from './table.module.css';

type Props<TData> = {
	table: Table<TData>;
	/** Pins the `<thead>` to the top of the viewport. Used for boxscore / team-stats. */
	stickyTop?: boolean;
};

/**
 * Universal thead renderer for all TanStack-based tables.
 *
 * - Reads `column.columnDef.meta` for sticky pinning, text alignment, group borders, and width.
 * - Supports multi-row header groups for tables with nested column definitions.
 * - Shows a sort-direction indicator (▲ / ▼) on the currently sorted column.
 * - All visual styling comes from table.module.css.
 */
export const UniversalTableHead = <TData,>({ table, stickyTop = false }: Props<TData>) => {
	const theadClasses = [styles.thead, stickyTop ? styles.theadSticky : ''].filter(Boolean).join(' ');

	return (
		<thead className={theadClasses}>
			{table.getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id} className={styles.trHead}>
					{headerGroup.headers.map((header) => {
						const meta = header.column.columnDef.meta;
						const isSticky = meta?.sticky === 'left';
						const stickyOffset = meta?.stickyOffset ?? '0';

						// Prefer explicit meta flag; fall back to detecting the last child in a column group
						const isLastInGroup =
							meta?.isLastInGroup ??
							(header.column.parent != null &&
								header.column.parent.columns[
									header.column.parent.columns.length - 1
								]?.id === header.column.id);

						const canSort = header.column.getCanSort();
						const sorted = header.column.getIsSorted();

						// meta.align has priority; sticky defaults to left; everything else center
						const isLeft =
							meta?.align === 'left' || (meta?.align == null && isSticky);

						const thClass = [
							styles.th,
							isLeft ? styles.thLeft : '',
							isSticky ? styles.thSticky : '',
							isLastInGroup ? styles.groupBorder : '',
							canSort ? styles.thSortable : '',
						]
							.filter(Boolean)
							.join(' ');

						return (
							<th
								key={header.id}
								colSpan={header.colSpan}
								style={{
									...(isSticky ? { left: stickyOffset } : {}),
									...(meta?.width ? { width: meta.width } : {}),
								}}
								className={thClass}
								onClick={header.column.getToggleSortingHandler()}
							>
								{header.isPlaceholder ? null : (
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
										{flexRender(header.column.columnDef.header, header.getContext())}
										{canSort && sorted && (
											<span className={styles.sortIcon}>
												{sorted === 'asc' ? '▲' : '▼'}
											</span>
										)}
									</span>
								)}
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
};
