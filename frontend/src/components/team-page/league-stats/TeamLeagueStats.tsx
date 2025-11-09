import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useTeamLeagueStats } from '@/hooks/queries/team/useTeamLeagueStats';
import { useTeamTotalStats } from '@/hooks/queries/team/useTeamTotalStats';
import { useTeamLeagueStatsTable } from '@/hooks/useTeamLeagueStats';
import { TeamStats } from '@/types/api/team';

import DatabaseSelect from './database-select';

const TeamLeagueStats: React.FC = () => {
	const { teamSlug } = useParams();
	const [selected, setSelected] = useState<'total' | 'home' | 'away'>('total');

	const { data: leagueStats } = useTeamLeagueStats(teamSlug!);
	const { data: totalStats } = useTeamTotalStats(teamSlug!);

	const leagueStatsRow: TeamStats[] = useMemo(() => {
		if (!leagueStats?.length) return [];
		return leagueStats.map((team) => {
			return team[selected];
		});
	}, [leagueStats, selected]);

	const selectTotalStats: TeamStats[] = useMemo(() => {
		if (!totalStats) return [];
		return [totalStats[selected]];
	}, [totalStats, selected]);

	const { TableHead, TableBody } = useTeamLeagueStatsTable(leagueStatsRow);
	const { TableFoot } = useTeamLeagueStatsTable(selectTotalStats);

	if (!leagueStats || !totalStats) return null;

	return (
		<section className="w-full h-fit py-4 flex flex-col gap-4 overflow-hidden">
			<Heading title="All Time League Record" />
			<DatabaseSelect selected={selected} setSelected={setSelected} />
			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</section>
	);
};

export default TeamLeagueStats;
