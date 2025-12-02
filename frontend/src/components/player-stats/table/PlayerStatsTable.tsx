import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { PlayerAllTimeStats } from '@/types/api/player';
import { SortingState } from '@tanstack/react-table';

import { usePlayerStatsTable } from './usePlayerStatsTable';

type PlayerStatsTableProps = {
	stats: PlayerAllTimeStats[] | undefined;
	prev: PlayerAllTimeStats[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ stats, prev, sorting, setSorting }) => {
	const { TableHead, TableBody } = usePlayerStatsTable(stats, prev, sorting, setSorting);

	if (!stats || stats.length === 0) {
		return <NoContent type="info" description={<p>There are no player stats in the database.</p>} />;
	}

	return (
		<div className="w-full overflow-x-scroll">
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</div>
	);
};

export default PlayerStatsTable;
