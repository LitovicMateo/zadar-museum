import React from 'react';

import NoContent from '@/components/no-content/NoContent';

const StaffLeagueStats: React.FC = () => {
	// minimal placeholder – add stats tables later
	return (
		<section>
			<NoContent type="info" description="No league stats available for this staff member yet." />
		</section>
	);
};

export default StaffLeagueStats;
