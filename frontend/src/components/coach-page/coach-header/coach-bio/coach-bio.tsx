import React from 'react';
import Flag from 'react-world-flags';

import { CoachDetailsResponse } from '@/types/api/coach';
import { getCoachBioInfo } from './coach-bio.utils';
import styles from './coach-bio.module.css';

type CoachBio = {
	coach: CoachDetailsResponse;
};

const CoachBio: React.FC<CoachBio> = ({ coach }) => {
	const { birthDateStr, deathDateStr, age, ageAtDeath } = getCoachBioInfo(coach);
	return (
			<div className={styles.root}>
				<div className={styles.borderBottom}>
					<h2 className={styles.title}>
						<span className={styles.firstName}>{coach.first_name}</span>
						<span className={styles.lastName}>{coach.last_name}</span>
					</h2>
				</div>
				<div className={styles.bioContainer}>
					<div className={styles.label}>
						Nationality:
						<div className={styles.flagWrapper}>
							{coach.nationality ? (
								<Flag className={styles.flagImg} code={coach.nationality} />
							) : (
								<span className={styles.grayText}>-</span>
							)}
						</div>
					</div>
					{deathDateStr ? (
						<div className={styles.label}>
							<span>{`Born: ${birthDateStr} — Died: ${deathDateStr}`}</span>
							{ageAtDeath !== null && <span className={styles.uppercase}>{`(aged ${ageAtDeath})`}</span>}
						</div>
					) : (
						birthDateStr && (
							<div className={styles.label}>
								{`Age: ${age}`}
								<span className={styles.uppercase}>{`(${birthDateStr})`}</span>
							</div>
						)
					)}
				</div>
			</div>
	);
};

export default CoachBio;
