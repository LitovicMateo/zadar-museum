import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useGameTeamStats } from '@/hooks/queries/game/useGameTeamStats';
import { useTeamStatsTable } from '@/hooks/useTeamStatsTable';

const TeamStats: React.FC = () => {
	const { gameId } = useParams();

	const { data } = useGameTeamStats(gameId!);

	const { TableBody, TableHead } = useTeamStatsTable(data!);

	return (
		<div className="flex flex-col gap-2">
			<Heading title="Team Stats" />
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</div>
	);
};

export default TeamStats;
