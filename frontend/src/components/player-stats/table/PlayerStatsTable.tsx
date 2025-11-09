import React from 'react';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/pages/Stats/UI/TableWrapper';
import { PlayerAllTimeStats } from '@/types/api/player';

import { usePlayerStatsTable } from './usePlayerStatsTable';

type PlayerStatsTableProps = {
	stats: PlayerAllTimeStats[] | undefined;
	prev: PlayerAllTimeStats[] | undefined;
};

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ stats, prev }) => {
	const { TableHead, TableBody } = usePlayerStatsTable(stats, prev);

	if (!stats || stats.length === 0) {
		return (
			<NoContent>
				<p>There are no player stats in the database.</p>
			</NoContent>
		);
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
