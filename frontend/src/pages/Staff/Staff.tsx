import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import StaffHeader from '@/components/Staff/StaffContent/StaffHeader/StaffHeader';
import { APP_ROUTES } from '@/constants/Routes';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

import StaffContent from './StaffContent';

import styles from '@/pages/Staff/Staff.module.css';

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
		<div className={styles.page}>
			<StaffHeader />
			<StaffContent />
		</div>
	);
};

export default Staff;
