import React from 'react';

import NoContent from '@/components/no-content/no-content';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import AnimatedTableWrapper from '@/components/ui/animated-table-wrapper';
import { TeamStatsRanking } from '@/types/api/team';
import { SortingState } from '@tanstack/react-table';

import { useTeamStatsTable } from './useTeamStatsTable';

type TeamStatsTableProps = {
	stats: TeamStatsRanking[] | undefined;
	isFetching: boolean;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const TeamStatsTable: React.FC<TeamStatsTableProps> = ({ stats, isFetching, sorting, setSorting }) => {
	const { table } = useTeamStatsTable(stats, sorting, setSorting);
	if (!stats || stats.length === 0) {
		return <NoContent type="info" description={<p>There are no team stats in the database.</p>} />;
	}

	if (isFetching) return null;

	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default TeamStatsTable;
