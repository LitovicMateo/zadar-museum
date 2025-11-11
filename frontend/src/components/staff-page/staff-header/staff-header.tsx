import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useStaffDetails } from '@/hooks/queries/staff/useStaffDetails';

const StaffHeader: React.FC = () => {
	const { staffId } = useParams();

	const { data: staffDetails } = useStaffDetails(staffId!);

	return (
		<section className={`w-full flex justify-center items-center min-h-[100px] ${zadarBg}`}>
			<h2 className="text-blue-50 text-2xl font-mono uppercase tracking-widest">
				{staffDetails?.first_name} {staffDetails?.last_name}
			</h2>
		</section>
	);
};

export default StaffHeader;
