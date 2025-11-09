import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import VenueAllTime from '@/components/venue-page/venue-all-time/venue-all-time';
import VenueGamelog from '@/components/venue-page/venue-gamelog/venue-gamelog';
import { useVenueTeamRecord } from '@/hooks/queries/venue/useVenueTeamRecord';

const VenueContent: React.FC = () => {
	const { venueSlug } = useParams();
	const { data: record } = useVenueTeamRecord(venueSlug!);

	if (!record) return <NoContent>No games have been played at this venue.</NoContent>;

	return (
		<PageContentWrapper>
			<VenueAllTime />
			<VenueGamelog />
		</PageContentWrapper>
	);
};

export default VenueContent;
