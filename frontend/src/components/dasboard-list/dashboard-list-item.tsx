import React, { useEffect, useRef, useState } from 'react';

type DashboardListItemProps = {
	item: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	};
};

const DashboardListItem: React.FC<DashboardListItemProps> = ({ item }) => {
	const date = `${item.createdAt}`.split('T')[0].split('-').reverse().join('/');
	const contentRef = useRef<HTMLDivElement | null>(null);
	const [tooltip, setTooltip] = useState<string | undefined>(undefined);

	useEffect(() => {
		// derive visible text from rendered element for tooltip
		const text = contentRef.current?.textContent?.trim();
		if (text && text.length > 0) setTooltip(text);
	}, []);

	return (
		<tr className="border-b hover:bg-gray-50 cursor-pointer">
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

export default DashboardListItem;
