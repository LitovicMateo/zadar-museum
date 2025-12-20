import React, { useRef, useMemo } from 'react';

type DashboardListItemProps = {
	item: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	};
};

const DashboardListItem: React.FC<DashboardListItemProps> = ({ item }) => {
	const date = useMemo(() => `${item.createdAt}`.split('T')[0].split('-').reverse().join('/'), [item.createdAt]);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const tooltip = useMemo(() => contentRef.current?.textContent?.trim() || undefined, []);

	return (
		<tr className="border-b hover:bg-gray-50" tabIndex={0} aria-label={`${tooltip ?? 'item'} row`}>
			<td className="py-2 px-4 align-middle">
				<div
					ref={contentRef}
					title={tooltip}
					className="text-sm font-medium text-gray-900 truncate"
					style={{ maxWidth: 'min(46ch, 100%)' }}
				>
					{item.item}
				</div>
			</td>
			<td className="py-2 px-4 text-right align-middle w-28">
				<div className="text-xs text-gray-400 uppercase font-mono">{date}</div>
			</td>
		</tr>
	);
};

export default React.memo(DashboardListItem);
