import { flexRender, Table } from '@tanstack/react-table';

import './types';
import styles from './table.module.css';

type FooterVariant = 'default' | 'gradient' | 'light';

type Props<TData> = {
table: Table<TData>;
/**
 * Controls the visual treatment of footer rows.
 *
 * - `'default'`  — slate-100 background, thick blue top border, bold text.
 * - `'gradient'` — slate-100 → slate-50 gradient, thick blue top border, bold.
 * - `'light'`    — slate-50 background, thin slate top border, semi-bold text.
 */
variant?: FooterVariant;
};

const trVariantClass: Record<FooterVariant, string> = {
default: styles.trFootDefault,
gradient: styles.trFootGradient,
light: styles.trFootLight,
};

/**
 * Universal tfoot renderer for all TanStack-based tables.
 *
 * Supply a second `useReactTable` instance (career / total data) and pass it
 * here — the separate-instance pattern keeps body and footer data independent.
 *
 * All visual styling comes from table.module.css.
 */
export const UniversalTableFooter = <TData,>({ table, variant = 'default' }: Props<TData>) => {
const trClass = trVariantClass[variant];

return (
<tfoot>
{table.getRowModel().rows.map((row) => (
<tr key={row.id} className={trClass}>
{row.getVisibleCells().map((cell) => {
const meta = cell.column.columnDef.meta;
const isSticky = meta?.sticky === 'left';
const stickyOffset = meta?.stickyOffset ?? '0';

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
styles.tdFoot,
isLeft ? styles.tdFootLeft : '',
isSticky ? styles.tdFootSticky : '',
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
))}
</tfoot>
);
};
