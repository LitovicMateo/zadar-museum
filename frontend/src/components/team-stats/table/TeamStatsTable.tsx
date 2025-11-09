import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { TeamStatsRanking } from '@/types/api/team';

import { useTeamStatsTable } from './useTeamStatsTable';

type TeamStatsTableProps = {
	stats: TeamStatsRanking[] | undefined;
	isFetching: boolean;
};

const TeamStatsTable: React.FC<TeamStatsTableProps> = ({ stats, isFetching }) => {
	const { TableHead, TableBody } = useTeamStatsTable(stats);

	if (!stats || stats.length === 0) {
		return (
			<NoContent>
				<p>There are no team stats in the database.</p>
			</NoContent>
		);
	}

	if (isFetching) return null;

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default TeamStatsTable;
