import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProfilePageWrapper from '@/components/ui/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

import StaffContent from './StaffContent/StaffContent';
import StaffHeader from './StaffContent/StaffHeader/StaffHeader';

import styles from './StaffPage.module.css';

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

	return (
		<ProfilePageWrapper
			header={<StaffHeader />}
			content={
				<main id="staff-content" tabIndex={-1} className={styles.staffMain}>
					<StaffContent />
				</main>
			}
		/>
	);
};

export default StaffPage;
