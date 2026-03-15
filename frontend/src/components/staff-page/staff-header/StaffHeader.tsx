import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/PlayerBg';
import styles from './StaffHeader.module.css';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

const StaffHeader: React.FC = () => {
	const { staffId } = useParams();

	const { data: staffDetails } = useStaffDetails(staffId!);

	return (
		<section className={`${styles.section} ${zadarBg}`}>
			<h2 className={styles.name}>
				{staffDetails?.first_name} {staffDetails?.last_name}
			</h2>
		</section>
	);
};

export default StaffHeader;
