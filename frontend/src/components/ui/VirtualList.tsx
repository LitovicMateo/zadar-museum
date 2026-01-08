import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

type VirtualListProps<T> = {
	items: T[];
	height: number;
	itemHeight: number;
	width?: number | string;
	renderItem: (item: T, index: number) => React.ReactNode;
	className?: string;
};

function Row<T>({ data, index, style }: ListChildComponentProps) {
	const { items, renderItem } = data as {
		items: T[];
		renderItem: (item: T, index: number) => React.ReactNode;
	};
	return (
		<div style={style} role="row">
			{renderItem(items[index], index)}
		</div>
	);
}

export default function VirtualList<T>({
	items,
	height,
	itemHeight,
	width = '100%',
	renderItem,
	className
}: VirtualListProps<T>) {
	if (!items || items.length === 0) return null;

	return (
		<div style={{ width }} className={className}>
			<List
				height={height}
				itemCount={items.length}
				itemSize={itemHeight}
				width={width}
				itemData={{ items, renderItem }}
			>
				{Row}
			</List>
		</div>
	);
}
