import React from 'react';

import VenueAllTime from '@/components/Venue/Content/VenueAllTimeStats/VenueAllTimeStats';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
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
