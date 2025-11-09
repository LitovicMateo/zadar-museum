import React from 'react';

type DashboardListItemProps = {
	item: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	};
};

const DashboardListItem: React.FC<DashboardListItemProps> = ({ item }) => {
	const date = `${item.createdAt}`.split('T')[0].split('-').reverse().join('/');
	return (
		<tr className="border-b hover:bg-gray-50 cursor-pointer text-xs">
			<td className="py-1.5">{item.item}</td>
			<td className="text-sm uppercase font-mono">{date}</td>
		</tr>
	);
};

export default DashboardListItem;
