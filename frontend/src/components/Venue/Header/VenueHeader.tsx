import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';

const VenueHeader = () => {
	const { venueSlug } = useParams();

	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<HeaderWrapper>
			<h2>{venue?.name}</h2>
		</HeaderWrapper>
	);
};

export default VenueHeader;
