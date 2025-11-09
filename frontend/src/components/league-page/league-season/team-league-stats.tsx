import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamLeagueSeasonStats } from '@/hooks/queries/league/useTeamLeagueStats';

import { useTeamLeagueStatsTable } from './useTeamLeagueStatsTable';

type TeamLeagueStatsProps = {
	season: string;
};

const TeamLeagueStats: React.FC<TeamLeagueStatsProps> = ({ season }) => {
	const { leagueSlug } = useParams();

	const { data: teamStats } = useTeamLeagueSeasonStats(leagueSlug!, season!);

	const stats = useMemo(() => {
		if (!teamStats) return [];
		const home = teamStats[0].stats.home;
		const away = teamStats[0].stats.away;
		const total = teamStats[0].stats.total;

		return [home, away, total];
	}, [teamStats]);

	const { TableBody, TableHead } = useTeamLeagueStatsTable(stats);

	if (teamStats === undefined) {
		return <NoContent>No data available.</NoContent>;
	}

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default TeamLeagueStats;
