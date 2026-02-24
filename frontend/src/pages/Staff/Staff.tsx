import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import StaffHeader from '@/components/staff-page/staff-header/staff-header';
import { APP_ROUTES } from '@/constants/routes';
import { useStaffDetails } from '@/hooks/queries/staff/useStaffDetails';

import StaffContent from './StaffContent';

const Staff: React.FC = () => {
	const { staffId } = useParams();
	const navigate = useNavigate();

	const { data: staffDetails, isFetched } = useStaffDetails(staffId!);

	useEffect(() => {
		if (isFetched && !staffDetails) {
			navigate(APP_ROUTES.home);
		}
	}, [isFetched, staffDetails, navigate]);

	return (
		<div className="flex flex-col gap-1">
			<StaffHeader />
			<StaffContent />
		</div>
	);
};

export default Staff;
