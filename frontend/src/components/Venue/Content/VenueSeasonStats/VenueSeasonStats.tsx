import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useVenueSeasonStatsTable } from '@/components/Venue/Content/VenueSeasonStats/UseVenueSeasonStatsTable';
import { useVenueSeasonLeagueStats } from '@/hooks/queries/venue/UseVenueSeasonLeagueStats';
import { useVenueSeasonStats } from '@/hooks/queries/venue/UseVenueSeasonStats';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';

import styles from './VenueSeasonStats.module.css';

const VenueSeasonStats = () => {
	const { venueSlug } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const { data: seasons } = useVenueSeasons(venueSlug!);

	const { data: seasonStats, isLoading: isLoadingSeasonStats } = useVenueSeasonStats(venueSlug!, selectedSeason);
	const { data: seasonLeagueStats, isLoading: isLoadingSeasonLeagueStats } = useVenueSeasonLeagueStats(
		venueSlug!,
		selectedSeason
	);

	const { table } = useVenueSeasonStatsTable(seasonLeagueStats);
	const { table: footTable } = useVenueSeasonStatsTable(seasonStats);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	if (!seasons || seasons.length === 0) {
		return <NoContent type="info" description="No season stats available for this venue." />;
	}
	if (isLoadingSeasonStats || isLoadingSeasonLeagueStats) {
		return <div className={styles.loading}>Loading...</div>;
	}
	if (!seasonStats || !seasonLeagueStats || seasonStats.length === 0) {
		return <NoContent type="info" description="No season stats available for this venue." />;
	}

	return (
		<section className={styles.content}>
			<SeasonSelect
				compact
				seasons={seasons}
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

export default VenueSeasonStats;
