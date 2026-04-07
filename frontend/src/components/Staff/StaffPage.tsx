import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProfilePageWrapper from '@/components/UI/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

import StaffContent from './StaffContent/StaffContent';
import StaffHeader from './StaffContent/StaffHeader/StaffHeader';

export type PlayerDB = 'zadar' | 'opponent';

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

	return <ProfilePageWrapper header={<StaffHeader />} content={<StaffContent />} />;
};

export default StaffPage;
