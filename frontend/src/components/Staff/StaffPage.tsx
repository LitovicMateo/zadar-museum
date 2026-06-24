import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import ProfilePageWrapper from '@/components/UI/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

import StaffContent from './StaffContent/StaffContent';
import StaffHeader from './StaffContent/StaffHeader/StaffHeader';

export type PlayerDB = 'main' | 'opponent';

const StaffPage: React.FC = () => {
	const { staffId } = useParams();
	const navigate = useNavigate();

	const { data: staffDetails, isFetched } = useStaffDetails(staffId!);

	useEffect(() => {
		if (!staffDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [staffDetails, isFetched, navigate]);

	if (!staffDetails) return null;

	return (
		<>
			<ProfilePageWrapper header={<StaffHeader />} content={<StaffContent />} />
			<FloatingEditButton to={`${APP_ROUTES.dashboard.staff.edit}${staffId}`} />
		</>
	);
};

export default StaffPage;
