import React from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from '@/components/UI/ErrorBoundary';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';

import VenueHero from './VenueHero/VenueHero';
import VenueContent from './Content/VenueContent';

const VenuePage: React.FC = () => {
	const { venueSlug } = useParams();
	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<ErrorBoundary>
					<VenueHero />
				</ErrorBoundary>
				<main id="venue-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<ErrorBoundary>
						<VenueContent />
					</ErrorBoundary>
				</main>
			</div>
			{venue && <FloatingEditButton to={`${APP_ROUTES.dashboard.venue.edit}${venue.documentId}`} />}
		</GamesProvider>
	);
};

export default VenuePage;
