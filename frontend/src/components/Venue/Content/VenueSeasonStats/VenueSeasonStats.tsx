import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useVenueSeasonStatsTable } from '@/components/venue-page/venue-gamelog/UseVenueSeasonStatsTable';
import { useVenueSeasonLeagueStats } from '@/hooks/queries/venue/UseVenueSeasonLeagueStats';
import { useVenueSeasonStats } from '@/hooks/queries/venue/UseVenueSeasonStats';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';

import styles from './VenueSeasonStats.module.css';

const VenueSeasonStats = () => {
	const { venueSlug } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const { data: seasons } = useVenueSeasons(venueSlug!);

	const { data: seasonStats } = useVenueSeasonStats(venueSlug!, selectedSeason);
	const { data: seasonLeagueStats } = useVenueSeasonLeagueStats(venueSlug!, selectedSeason);

	const { table } = useVenueSeasonStatsTable(seasonLeagueStats);
	const { table: footTable } = useVenueSeasonStatsTable(seasonStats);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	if (!seasonStats || !seasonLeagueStats || seasonStats.length === 0) {
		return null;
	}

	if (!seasons || seasons.length === 0) {
		return null;
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
