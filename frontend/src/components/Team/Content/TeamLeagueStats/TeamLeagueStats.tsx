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

	const hasHome = !!leagueStats?.some((team) => (team.home?.games ?? 0) > 0);
	const hasAway = !!leagueStats?.some((team) => (team.away?.games ?? 0) > 0);
	const hasNeutral = !!leagueStats?.some((team) => (team.neutral?.games ?? 0) > 0);

	// If the current selection becomes unavailable, fall back to 'total'.
	const effectiveSelected: 'total' | 'home' | 'away' | 'neutral' =
		(selected === 'home' && !hasHome) || (selected === 'away' && !hasAway) || (selected === 'neutral' && !hasNeutral)
			? 'total'
			: selected;

	const leagueStatsRow: TeamStats[] = useMemo(() => {
		if (!leagueStats?.length) return [];
		return leagueStats.map((team) => team[effectiveSelected]).filter((row): row is TeamStats => row != null);
	}, [leagueStats, effectiveSelected]);

	const selectTotalStats: TeamStats[] = useMemo(() => {
		if (!totalStats) return [];
		const row = totalStats[effectiveSelected];
		return row ? [row] : [];
	}, [totalStats, effectiveSelected]);

	const { table: mainTable } = useTeamLeagueStatsTable(leagueStatsRow);
	const { table: footTable } = useTeamLeagueStatsTable(selectTotalStats);

	if (!leagueStats || !totalStats) return null;

	return (
		<section className={styles.section}>
			<DatabaseSelect
				selected={effectiveSelected}
				setSelected={setSelected}
				homeDisabled={!hasHome}
				awayDisabled={!hasAway}
				neutralDisabled={!hasNeutral}
			/>
			<TableWrapper>
				<UniversalTableHead table={mainTable} />
				<UniversalTableBody table={mainTable} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default TeamLeagueStats;
