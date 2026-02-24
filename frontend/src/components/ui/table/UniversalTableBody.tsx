import { flexRender, Row, Table } from '@tanstack/react-table';

import './types';
import styles from './table.module.css';

type Props<TData> = {
table: Table<TData>;
/** Return a CSS module key (e.g. 'trStarter') to apply a variant class to a row. */
rowVariant?: (row: Row<TData>) => string | undefined;
};

/**
 * Universal tbody renderer for all TanStack-based tables.
 *
 * Reads `column.columnDef.meta` for:
 * - `sticky` / `stickyOffset`  — frozen left columns
 * - `align`                     — text alignment override
 * - `width`                     — CSS width value (e.g. '200px')
 * - `isLastInGroup`             — right border for column-group separators
 *
 * All visual styling comes from table.module.css.
 */
export const UniversalTableBody = <TData,>({ table, rowVariant }: Props<TData>) => {
return (
<tbody>
{table.getRowModel().rows.map((row) => {
const variant = rowVariant?.(row);
const variantClass = variant ? styles[variant] : undefined;
return (
<tr key={row.id} className={[styles.trBody, variantClass].filter(Boolean).join(' ')}>
{row.getVisibleCells().map((cell) => {
const meta = cell.column.columnDef.meta;
const isSticky = meta?.sticky === 'left';
const stickyOffset = meta?.stickyOffset ?? '0';

// Prefer explicit meta flag; fall back to detecting last child in a column group
const isLastInGroup =
meta?.isLastInGroup ??
(cell.column.parent != null &&
cell.column.parent.columns[
cell.column.parent.columns.length - 1
]?.id === cell.column.id);

// meta.align has priority; sticky defaults to left; everything else center
const isLeft =
meta?.align === 'left' || (meta?.align == null && isSticky);

const tdClass = [
styles.td,
isLeft ? styles.tdLeft : '',
isSticky ? styles.tdSticky : '',
isLastInGroup ? styles.groupBorder : '',
]
.filter(Boolean)
.join(' ');

return (
<td
key={cell.id}
style={{
...(isSticky ? { left: stickyOffset } : {}),
...(meta?.width ? { width: meta.width } : {}),
}}
className={tdClass}
>
{flexRender(cell.column.columnDef.cell, cell.getContext())}
</td>
);
})}
</tr>
);
})}
</tbody>
);
};
