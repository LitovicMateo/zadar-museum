import { Fragment } from 'react';

import TableWrapper from '@/components/UI/TableWrapper';
import tableStyles from '@/components/UI/table/table.module.css';

import { useStatsSort } from './useStatsSort';
import type { FooterVariant, SortState, StatsColumn, StatsDataRow, StatsGroup } from './types';

type Props<T> = {
	columns: StatsColumn<T>[];
	groups: StatsGroup<T>[];
	footer?: { rows: StatsDataRow<T>[]; variant?: FooterVariant };
	stickyTop?: boolean;
	noOverflow?: boolean;
	initialSort?: SortState;
};

const footVariantClass: Record<FooterVariant, string> = {
	default: tableStyles.trFootDefault,
	gradient: tableStyles.trFootGradient,
	light: tableStyles.trFootLight,
};

function colClasses<T>(col: StatsColumn<T>) {
	const meta = col.meta;
	const isSticky = meta?.sticky === 'left';
	const isLeft = meta?.align === 'left' || (meta?.align == null && isSticky);
	return { meta, isSticky, isLeft };
}

/**
 * Framework-agnostic stats table. Replaces the `useReactTable` +
 * UniversalTableHead/Body/Footer trio for migrated tables: same design (reuses
 * table.module.css), click-to-sort headers, sticky columns, group borders, and
 * footer variants — plus stacked regular-season / playoff / total sub-rows.
 */
export function StatsTable<T>({
	columns,
	groups,
	footer,
	stickyTop = false,
	noOverflow = false,
	initialSort,
}: Props<T>) {
	const { sort, toggleSort, sortedGroups } = useStatsSort(columns, groups, initialSort);

	const theadClass = [tableStyles.thead, stickyTop ? tableStyles.theadSticky : '']
		.filter(Boolean)
		.join(' ');

	const renderCell = (col: StatsColumn<T>, row: StatsDataRow<T>, colIndex: number) => {
		const { meta, isSticky, isLeft } = colClasses(col);
		const isSorted = sort?.columnId === col.id;
		const tdClass = [
			tableStyles.td,
			isLeft ? tableStyles.tdLeft : '',
			isSticky ? tableStyles.tdSticky : '',
			isSorted && !isSticky ? tableStyles.tdSorted : '',
			meta?.isLastInGroup ? tableStyles.groupBorder : '',
		]
			.filter(Boolean)
			.join(' ');

		// First column: a phase sub-row replaces the column's own content with its label.
		const content =
			colIndex === 0 && row.label != null ? (
				<span className={row.indent ? tableStyles.phaseIndent : undefined}>{row.label}</span>
			) : (
				col.cell(row.data)
			);

		return (
			<td
				key={col.id}
				className={tdClass}
				style={{
					...(isSticky ? { left: meta?.stickyOffset ?? '0' } : {}),
					...(meta?.width ? { width: meta.width } : {}),
				}}
			>
				{content}
			</td>
		);
	};

	return (
		<TableWrapper noOverflow={noOverflow}>
			<thead className={theadClass}>
				<tr className={tableStyles.trHead}>
					{columns.map((col) => {
						const { meta, isSticky, isLeft } = colClasses(col);
						const canSort = !!col.sortValue;
						const sorted = sort?.columnId === col.id ? sort.dir : false;
						const thClass = [
							tableStyles.th,
							isLeft ? tableStyles.thLeft : '',
							isSticky ? tableStyles.thSticky : '',
							sorted ? tableStyles.thSorted : '',
							meta?.isLastInGroup ? tableStyles.groupBorder : '',
							canSort ? tableStyles.thSortable : '',
						]
							.filter(Boolean)
							.join(' ');
						return (
							<th
								key={col.id}
								className={thClass}
								style={{
									...(isSticky ? { left: meta?.stickyOffset ?? '0' } : {}),
									...(meta?.width ? { width: meta.width } : {}),
								}}
								onClick={canSort ? () => toggleSort(col.id) : undefined}
							>
								<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
									{col.header}
									{canSort && sorted && (
										<span className={tableStyles.sortIcon}>{sorted === 'asc' ? '▲' : '▼'}</span>
									)}
								</span>
							</th>
						);
					})}
				</tr>
			</thead>

			<tbody>
				{sortedGroups.map((group) => (
					<Fragment key={group.key}>
						{group.heading != null && (
							<tr>
								<td className={tableStyles.groupHeading} colSpan={columns.length}>
									{group.heading}
								</td>
							</tr>
						)}
						{group.rows.map((row) => {
							const trClass = [
								tableStyles.trBody,
								row.emphasize ? tableStyles.trPhaseTotal : '',
								row.rowClass ?? '',
							]
								.filter(Boolean)
								.join(' ');
							return (
								<tr key={row.key} className={trClass}>
									{columns.map((col, i) => renderCell(col, row, i))}
								</tr>
							);
						})}
					</Fragment>
				))}
			</tbody>

			{footer && footer.rows.length > 0 && (
				<tfoot>
					{footer.rows.map((row) => (
						<tr key={row.key} className={footVariantClass[footer.variant ?? 'default']}>
							{columns.map((col) => {
								const { meta, isSticky, isLeft } = colClasses(col);
								const tdClass = [
									tableStyles.tdFoot,
									isLeft ? tableStyles.tdFootLeft : '',
									isSticky ? tableStyles.tdFootSticky : '',
									meta?.isLastInGroup ? tableStyles.groupBorder : '',
								]
									.filter(Boolean)
									.join(' ');
								return (
									<td
										key={col.id}
										className={tdClass}
										style={{
											...(isSticky ? { left: meta?.stickyOffset ?? '0' } : {}),
											...(meta?.width ? { width: meta.width } : {}),
										}}
									>
										{col.cell(row.data)}
									</td>
								);
							})}
						</tr>
					))}
				</tfoot>
			)}
		</TableWrapper>
	);
}
