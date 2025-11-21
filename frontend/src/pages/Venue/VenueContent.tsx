import React from 'react';

import PageContentWrapper from '@/components/ui/page-content-wrapper';
import VenueAllTime from '@/components/venue-page/venue-all-time/venue-all-time';
import VenueGamelog from '@/components/venue-page/venue-gamelog/venue-gamelog';

const VenueContent: React.FC = () => {
	return (
		<PageContentWrapper>
			<VenueAllTime />
			<VenueGamelog />
		</PageContentWrapper>
	);
};

export default VenueContent;
