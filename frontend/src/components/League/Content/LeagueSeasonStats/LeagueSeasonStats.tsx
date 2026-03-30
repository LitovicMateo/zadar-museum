import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { useTeamLeagueStatsTable } from '@/components/League/Content/LeagueSeasonStats/UseTeamLeagueStatsTable';
import TableWrapper from '@/components/Stats/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter } from '@/components/UI/table';
import { UniversalTableHead } from '@/components/UI/table/UniversalTableHead';
import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { useTeamLeagueSeasonStats } from '@/hooks/queries/league/UseTeamLeagueStats';

import styles from './LeagueSeasonStats.module.css';

const LeagueSeasonStats = () => {
	const { leagueSlug } = useParams();

	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: seasons } = useLeagueSeasons(leagueSlug!);
	const { data: leagueGamelog } = useLeagueGames(leagueSlug!, selectedSeason);

	const { data: teamStats } = useTeamLeagueSeasonStats(leagueSlug!, selectedSeason);

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

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	if (leagueGamelog === undefined || seasons === undefined) return null;

	return (
		<section className={styles.section}>
			<SeasonSelect
				compact
				seasons={seasons!}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
			/>
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default LeagueSeasonStats;
