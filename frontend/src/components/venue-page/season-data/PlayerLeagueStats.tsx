import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/TableWrapper';
import { usePlayerLeagueStats } from '@/hooks/queries/league/UsePlayerLeagueStats';

import { usePlayerSeasonLeagueStatsTable } from './UsePlayerSeasonLeagueStatsTable';

type PlayerLeagueStatsProps = {
	season: string;
};

const PlayerLeagueStats: React.FC<PlayerLeagueStatsProps> = ({ season }) => {
	const { leagueSlug } = useParams();

	const { data: playerStats } = usePlayerLeagueStats(leagueSlug!, season!);

	const { table } = usePlayerSeasonLeagueStatsTable(playerStats!);

	if (playerStats === undefined || playerStats.length === 0) {
		return <NoContent type="info" description="No data available." />;
	}

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default PlayerLeagueStats;
