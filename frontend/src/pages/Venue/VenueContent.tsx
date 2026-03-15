import React from 'react';

import PageContentWrapper from '@/components/ui/PageContentWrapper';
import VenueAllTime from '@/components/venue-page/venue-all-time/VenueAllTime';
import VenueGamelog from '@/components/venue-page/venue-gamelog/VenueGamelog';

const VenueContent: React.FC = () => {
	return (
		<PageContentWrapper>
			<VenueAllTime />
			<VenueGamelog />
		</PageContentWrapper>
	);
};

export default VenueContent;
