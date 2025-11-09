import React from 'react';
import { useParams } from 'react-router-dom';

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

	if (playerStats === undefined) return null;

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default PlayerLeagueStats;
