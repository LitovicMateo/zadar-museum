import React from 'react';

import DashboardListItem from './dashboard-list-item';

type DashboardListContentProps = {
	title: string;
	header: string;
	items?: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	}[];
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
};

const DashboardListContent: React.FC<DashboardListContentProps> = ({
	header,
	items,
	isError,
	isLoading,
	errorMessage,
	title
}) => {
	if (isLoading) {
		return <p className="text-gray-500">Loading...</p>;
	}
	if (isError) {
		return <p className="text-red-600">{errorMessage}</p>;
	}

	if (!items?.length) {
		return <p className="text-gray-500">No {title.toLowerCase()} found</p>;
	}

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md">
				<table className="w-full table-fixed">
					<thead>
						<tr>
							<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase font-medium">
								{header}
							</th>
							<th className="px-4 py-2 text-right text-xs text-gray-500 uppercase font-medium">Date</th>
						</tr>
					</thead>
					<tbody>
						{items.map((it) => (
							<DashboardListItem key={it.id} item={it} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardListContent;
