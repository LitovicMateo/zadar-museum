import React from 'react';

import StaffGamelog from '@/components/staff-page/staff-gamelog/staff-gamelog';
import PageContentWrapper from '@/components/ui/page-content-wrapper';

const StaffContent: React.FC = () => {
	// The staff page should only show the list of games the staff member was involved in.
	// The `StaffGamelog` component is responsible for fetching and rendering that list.
	return (
		<PageContentWrapper>
			<StaffGamelog />
		</PageContentWrapper>
	);
};

export default StaffContent;
