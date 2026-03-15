import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import VenueHeader from '@/components/venue-page/venue-header/VenueHeader';
import { APP_ROUTES } from '@/constants/Routes';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';

import VenueContent from './VenueContent';

const Venue: React.FC = () => {
	const { venueSlug } = useParams();
	const navigate = useNavigate();

	const { data: venue, isFetched } = useVenueDetails(venueSlug!);

	useEffect(() => {
		if (!venue && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [venue, isFetched, navigate]);

	return (
		<div className="flex flex-col gap-2">
			<VenueHeader />
			<VenueContent />
		</div>
	);
};

export default Venue;
