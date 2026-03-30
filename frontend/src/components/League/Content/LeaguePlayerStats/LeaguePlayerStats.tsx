import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { usePlayerLeagueStats } from '@/hooks/queries/league/UsePlayerLeagueStats';

import { usePlayerSeasonLeagueStatsTable } from './usePlayerSeasonLeagueStatsTable';

import styles from './PlayerLeagueStats.module.css';

const LeaguePlayerStats: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: seasons } = useLeagueSeasons(leagueSlug!);

	const { data: playerStats } = usePlayerLeagueStats(leagueSlug!, selectedSeason!);

	const { table } = usePlayerSeasonLeagueStatsTable(playerStats!);

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	if (seasons === undefined) return null;

	if (playerStats === undefined || playerStats.length === 0) {
		return <NoContent type="info" description="No data available." />;
	}

	return (
		<section className={styles.section}>
			<SeasonSelect
				compact
				seasons={seasons!}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
			/>
			<DynamicContentWrapper>
				<TableWrapper>
					<UniversalTableHead table={table} />
					<UniversalTableBody table={table} />
				</TableWrapper>
			</DynamicContentWrapper>
		</section>
	);
};

export default LeaguePlayerStats;
