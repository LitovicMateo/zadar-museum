import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useVenueDetails } from '@/hooks/queries/venue/useVenueDetails';

const VenueHeader: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<section className={`w-full flex justify-center items-center min-h-[100px] ${zadarBg}`}>
			<h2 className="text-blue-50 text-2xl font-mono uppercase tracking-widest">{venue?.name}</h2>
		</section>
	);
};

export default VenueHeader;
