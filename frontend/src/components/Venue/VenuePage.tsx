import { useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';

import FloatingEditButton from '../UI/FloatingEditButton/FloatingEditButton';
import ProfilePageWrapper from '../UI/ProfilePageWrapper/ProfilePageWrapper';
import VenueContent from './Content/VenueContent';
import VenueHeader from './Header/VenueHeader';

const VenuePage = () => {
	const { venueSlug } = useParams();
	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<>
			<ProfilePageWrapper header={<VenueHeader />} content={<VenueContent />} />
			{venue && <FloatingEditButton to={`${APP_ROUTES.dashboard.venue.edit}${venue.documentId}`} />}
		</>
	);
};

export default VenuePage;
