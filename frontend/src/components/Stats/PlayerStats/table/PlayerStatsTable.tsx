import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import AnimatedTableWrapper from '@/components/UI/AnimatedTableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { PlayerAllTimeStats } from '@/types/api/Player';
import { SortingState } from '@tanstack/react-table';

import { usePlayerStatsTable } from './UsePlayerStatsTable';

type PlayerStatsTableProps = {
	stats: PlayerAllTimeStats[] | undefined;
	prev: PlayerAllTimeStats[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ stats, prev, sorting, setSorting }) => {
	const { table } = usePlayerStatsTable(stats, prev, sorting, setSorting);

	if (!stats || stats.length === 0) {
		return <NoContent type="info" description={<p>There are no player stats in the database.</p>} />;
	}

	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default PlayerStatsTable;
