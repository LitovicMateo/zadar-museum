import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import {
	UniversalTableBody,
	UniversalTableFooter,
	UniversalTableHead,
} from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamLeagueSeasonStats } from '@/hooks/queries/league/useTeamLeagueStats';

import { useTeamLeagueStatsTable } from './useTeamLeagueStatsTable';

type TeamLeagueStatsProps = {
	season: string;
};

const TeamLeagueStats: React.FC<TeamLeagueStatsProps> = ({ season }) => {
	const { leagueSlug } = useParams();

	const { data: teamStats } = useTeamLeagueSeasonStats(leagueSlug!, season!);

	// Home/Away rows → table body
	const bodyStats = useMemo(() => {
		if (!teamStats || teamStats.length === 0) return [];
		return [teamStats[0].stats.home, teamStats[0].stats.away];
	}, [teamStats]);

	// Total row → dedicated footer table (keeps body data independent)
	const footStats = useMemo(() => {
		if (!teamStats || teamStats.length === 0) return [];
		return [teamStats[0].stats.total];
	}, [teamStats]);

	const { table } = useTeamLeagueStatsTable(bodyStats);
	const { table: footTable } = useTeamLeagueStatsTable(footStats);

	if (teamStats === undefined || teamStats.length === 0) {
		return <NoContent type="info" description="No data available." />;
	}

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
			<UniversalTableFooter table={footTable} variant="light" />
		</TableWrapper>
	);
};

export default TeamLeagueStats;
