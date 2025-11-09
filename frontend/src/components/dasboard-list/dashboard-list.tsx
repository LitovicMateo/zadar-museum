import React from 'react';

import DashboardListContent from './dashboard-list-content';
import DashboardListWrapper from './dashboard-list-wrapper';

export type DashboardListItem = {
	id: number;
	item: React.ReactElement;
	createdAt: string;
};

type DashboardListProps = {
	title: string;
	header: string;
	items?: DashboardListItem[];
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
};

const DasboardList: React.FC<DashboardListProps> = ({ errorMessage, header, isError, isLoading, title, items }) => {
	return (
		<DashboardListWrapper title={title}>
			<DashboardListContent
				title={title}
				header={header}
				items={items}
				isError={isError}
				isLoading={isLoading}
				errorMessage={errorMessage}
			/>
		</DashboardListWrapper>
	);
};

export default DasboardList;
