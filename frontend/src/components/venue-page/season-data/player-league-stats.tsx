import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/components/ui/table-wrapper';
import { usePlayerLeagueStats } from '@/hooks/queries/league/usePlayerLeagueStats';

import { usePlayerSeasonLeagueStatsTable } from './usePlayerSeasonLeagueStatsTable';

type PlayerLeagueStatsProps = {
	season: string;
};

const PlayerLeagueStats: React.FC<PlayerLeagueStatsProps> = ({ season }) => {
	const { leagueSlug } = useParams();

	const { data: playerStats } = usePlayerLeagueStats(leagueSlug!, season!);

	const { TableBody, TableHead } = usePlayerSeasonLeagueStatsTable(playerStats!);

	if (playerStats === undefined || playerStats.length === 0) {
		return <NoContent type="info" description="No data available." />;
	}

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default PlayerLeagueStats;
