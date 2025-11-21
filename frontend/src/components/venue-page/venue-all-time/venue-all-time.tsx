import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useVenueTeamRecord } from '@/hooks/queries/venue/useVenueTeamRecord';

import VenueStats from './venue-stats';

const VenueAllTime: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: record } = useVenueTeamRecord(venueSlug!);

	if (!record || record.games === 0) {
		return null;
	}

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Record" />
			<VenueStats record={record} />
		</section>
	);
};

export default VenueAllTime;
