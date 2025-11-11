import React from 'react';

import NoContent from '@/components/no-content/no-content';

const StaffGamelog: React.FC = () => {
	// minimal placeholder – extend later with actual gamelog table
	return (
		<section>
			<NoContent>No gamelog available for this staff member yet.</NoContent>
		</section>
	);
};

export default StaffGamelog;
