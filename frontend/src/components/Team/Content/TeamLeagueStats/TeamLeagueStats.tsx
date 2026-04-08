import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useTeamLeagueStatsTable } from '@/hooks/UseTeamLeagueStats';
import { useTeamLeagueStats } from '@/hooks/queries/team/UseTeamLeagueStats';
import { useTeamTotalStats } from '@/hooks/queries/team/UseTeamTotalStats';
import { TeamStats } from '@/types/api/Team';

import DatabaseSelect from './DatabaseSelect';

import styles from './TeamLeagueStats.module.css';

const TeamLeagueStats: React.FC = () => {
	const { teamSlug } = useParams();
	const [selected, setSelected] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

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

	const { table: mainTable } = useTeamLeagueStatsTable(leagueStatsRow);
	const { table: footTable } = useTeamLeagueStatsTable(selectTotalStats);

	if (!leagueStats || !totalStats) return null;

	return (
		<section className={styles.section}>
			<DatabaseSelect selected={selected} setSelected={setSelected} />
			<TableWrapper>
				<UniversalTableHead table={mainTable} />
				<UniversalTableBody table={mainTable} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default TeamLeagueStats;
