import React from 'react';
import Flag from 'react-world-flags';

import { RefereeDetailsResponse } from '@/types/api/Referee';

import styles from './RefereeBio.module.css';

type RefereeBio = {
	referee: RefereeDetailsResponse;
};

const RefereeBio: React.FC<RefereeBio> = ({ referee }) => {
	return (
		<div className={styles.bio}>
			<div className={styles.nameBlock}>
				<h2 className={styles.name}>
					<span className={styles.firstName}>{referee.first_name}</span>
					<span className={styles.lastName}>{referee.last_name}</span>
				</h2>
			</div>
			<div className={styles.details}>
				{referee.nationality && (
					<span className={`${styles.detail} ${styles.nationalityRow}`}>
						Nationality:
						<div className={styles.flag}>
							{referee.nationality ? (
								<Flag className={styles.flagImg} code={referee.nationality} />
							) : (
								<span className={styles.muted}>-</span>
							)}
						</div>
					</span>
				)}
			</div>
		</div>
	);
};

export default RefereeBio;
