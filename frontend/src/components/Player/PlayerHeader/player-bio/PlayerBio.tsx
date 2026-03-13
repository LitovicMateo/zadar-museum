import React from 'react';
import Flag from 'react-world-flags';
import { format } from 'date-fns';

import { PlayerResponse } from '@/types/api/Player';
import { calculateAge } from '@/utils/CalculateAge';

import styles from './PlayerBio.module.css';

type PlayerBio = {
	player: PlayerResponse;
};

const PlayerBio: React.FC<PlayerBio> = ({ player }) => {
	const birthDateStr =
		!!player.date_of_birth &&
		format(new Date(player.date_of_birth), 'd MMM yyyy');

	const deathDateStr = !!player.date_of_death && format(new Date(player.date_of_death), 'd MMM yyyy');

	const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null;
	const ageAtDeath = player.date_of_birth && player.date_of_death ? calculateAge(player.date_of_birth, player.date_of_death) : null;
	return (
		<div className={styles.bio}>
			<div className={styles.nameBlock}>
				<h2 className={styles.name}>
					<span className={styles.firstName}>{player.first_name}</span>
					<span className={styles.lastName}>{player.last_name}</span>
				</h2>
			</div>
			<div className={styles.details}>
				<span className={`${styles.detail} ${styles.nationalityRow}`}>
					Nationality:
					<div className={styles.flag}>
						{player.nationality ? (
							<Flag className={styles.flagImg} code={player.nationality} />
						) : (
							<span className={styles.muted}>-</span>
						)}
					</div>
				</span>
				<span className={styles.detail}>
					Position:
					<span className={styles.positionValue}>
						{player.primary_position ? (
							<>{player.primary_position}{player.secondary_position ? ` / ${player.secondary_position}` : ''}</>
						) : (
							<span className={styles.muted}>-</span>
						)}
					</span>
				</span>
				{player.height && (
					<span className={styles.detail}>
						Height:
						<span>{player.height} cm</span>
					</span>
				)}
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

export default PlayerBio;
