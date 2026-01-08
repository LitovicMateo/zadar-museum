import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

type VirtualTableProps<T> = {
	rows: T[];
	height: number;
	rowHeight: number;
	width?: number | string;
	renderRow: (row: T, index: number) => React.ReactNode;
	className?: string;
};

const OuterTbody = React.forwardRef<HTMLTableSectionElement, any>((props, ref) => {
	return <tbody ref={ref} {...props} />;
});
OuterTbody.displayName = 'OuterTbody';

function Row<T>({ data, index, style }: ListChildComponentProps) {
	const { rows, renderRow } = data as { rows: T[]; renderRow: (row: T, index: number) => React.ReactNode };
	// apply row style to tr to preserve positioning
	return (
		<tr style={style} role="row">
			{renderRow(rows[index], index)}
		</tr>
	);
}

export default function VirtualTable<T>({
	rows,
	height,
	rowHeight,
	width = '100%',
	renderRow,
	className
}: VirtualTableProps<T>) {
	if (!rows || rows.length === 0) return null;

	return (
		<div style={{ width }} className={className}>
			<List
				height={height}
				itemCount={rows.length}
				itemSize={rowHeight}
				width={width}
				itemData={{ rows, renderRow }}
				outerElementType={OuterTbody as any}
			>
				{Row}
			</List>
		</div>
	);
}
