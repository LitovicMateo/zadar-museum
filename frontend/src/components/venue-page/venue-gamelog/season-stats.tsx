import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useVenueSeasonLeagueStats } from '@/hooks/queries/venue/useVenueSeasonLeagueStats';
import { useVenueSeasonStats } from '@/hooks/queries/venue/useVenueSeasonStats';

import { useVenueSeasonStatsTable } from './useVenueSeasonStatsTable';

type SeasonStatsProps = {
	season: string;
};

const SeasonStats: React.FC<SeasonStatsProps> = ({ season }) => {
	const { venueSlug } = useParams();

	const { data: seasonStats } = useVenueSeasonStats(venueSlug!, season);
	const { data: seasonLeagueStats } = useVenueSeasonLeagueStats(venueSlug!, season);

	const { TableHead, TableBody } = useVenueSeasonStatsTable(seasonLeagueStats);
	const { TableFoot } = useVenueSeasonStatsTable(seasonStats);

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
			<TableFoot />
		</TableWrapper>
	);
};

export default SeasonStats;
