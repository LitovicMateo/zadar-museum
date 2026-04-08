import React from 'react';
import Flag from 'react-world-flags';

import { CoachDetailsResponse } from '@/types/api/Coach';

import { getCoachBioInfo } from './CoachBio.utils';

import styles from './CoachBio.module.css';

type CoachBio = {
	coach: CoachDetailsResponse;
};

const CoachBio: React.FC<CoachBio> = ({ coach }) => {
	const { birthDateStr, deathDateStr, age, ageAtDeath } = getCoachBioInfo(coach);
	return (
		<div className={styles.bio}>
			<div className={styles.nameBlock}>
				<h2 className={styles.name}>
					<span className={styles.firstName}>{coach.first_name}</span>
					<span className={styles.lastName}>{coach.last_name}</span>
				</h2>
			</div>
			<div className={styles.details}>
				<span className={`${styles.detail} ${styles.nationalityRow}`}>
					Nationality:
					<div className={styles.flag}>
						{coach.nationality ? (
							<Flag className={styles.flagImg} code={coach.nationality} />
						) : (
							<span className={styles.muted}>-</span>
						)}
					</div>
				</span>
				{deathDateStr ? (
					<span className={styles.detail}>
						<span>
							Born: <span className={styles.birthDate}>{birthDateStr}</span> — Died: {deathDateStr}
						</span>
						{ageAtDeath !== null && <span>{`(aged ${ageAtDeath})`}</span>}
					</span>
				) : (
					birthDateStr && (
						<span className={styles.detail}>
							{`Age: ${age}`}
							<span className={styles.birthDate}>{` (${birthDateStr})`}</span>
						</span>
					)
				)}
			</div>
		</div>
	);
};

export default CoachBio;
