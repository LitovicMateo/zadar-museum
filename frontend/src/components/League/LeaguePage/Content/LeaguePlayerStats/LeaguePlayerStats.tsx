import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import { usePlayerSeasonLeagueStatsTable } from '@/components/venue-page/season-data/UsePlayerSeasonLeagueStatsTable';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { usePlayerLeagueStats } from '@/hooks/queries/league/UsePlayerLeagueStats';

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
