import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/Heading';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useVenueSeasonLeagueStats } from '@/hooks/queries/venue/UseVenueSeasonLeagueStats';
import { useVenueSeasonStats } from '@/hooks/queries/venue/UseVenueSeasonStats';

import { useVenueSeasonStatsTable } from '../../Venue/Content/VenueSeasonStats/UseVenueSeasonStatsTable';

type SeasonStatsProps = {
	season: string;
};

const SeasonStats: React.FC<SeasonStatsProps> = ({ season }) => {
	const { venueSlug } = useParams();

	const { data: seasonStats } = useVenueSeasonStats(venueSlug!, season);
	const { data: seasonLeagueStats } = useVenueSeasonLeagueStats(venueSlug!, season);

	const { table } = useVenueSeasonStatsTable(seasonLeagueStats);
	const { table: footTable } = useVenueSeasonStatsTable(seasonStats);

	if (!seasonStats || !seasonLeagueStats || seasonStats.length === 0) {
		return null;
	}

	return (
		<>
			<Heading title="Season Stats" type="secondary" />

			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</>
	);
};

export default SeasonStats;
