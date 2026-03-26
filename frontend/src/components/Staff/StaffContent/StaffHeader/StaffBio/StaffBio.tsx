import React from 'react';
import Flag from 'react-world-flags';

import { StaffDetailsResponse } from '@/types/api/Staff';

import styles from './StaffBio.module.css';

type StaffBio = {
	staff: StaffDetailsResponse;
};

const StaffBio: React.FC<StaffBio> = ({ staff }) => {
	return (
		<div className={styles.bio}>
			<div className={styles.nameBlock}>
				<h2 className={styles.name}>
					<span className={styles.firstName}>{staff.first_name}</span>
					<span className={styles.lastName}>{staff.last_name}</span>
				</h2>
			</div>
			<div className={styles.details}>
				{staff.nationality && (
					<span className={`${styles.detail} ${styles.nationalityRow}`}>
						Nationality:
						<div className={styles.flag}>
							{staff.nationality ? (
								<Flag className={styles.flagImg} code={staff.nationality} />
							) : (
								<span className={styles.muted}>-</span>
							)}
						</div>
					</span>
				)}
				<span className={styles.detail}>{staff.role}</span>
			</div>
		</div>
	);
};

export default StaffBio;
