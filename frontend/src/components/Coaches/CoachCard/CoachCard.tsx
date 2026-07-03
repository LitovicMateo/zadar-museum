import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';
import { User } from 'lucide-react';

import { APP_ROUTES } from '@/constants/Routes';
import { CoachDirectoryEntry } from '@/types/api/Coach';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './CoachCard.module.css';

interface CoachCardProps {
	coach: CoachDirectoryEntry;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
	const imageUrl = coach.image?.url ? getImageUrl(coach.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.coach(coach.documentId)} className={styles.cardLink}>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img
							src={imageUrl}
							alt={`${coach.first_name} ${coach.last_name}`}
							className={styles.image}
							loading="lazy"
						/>
					) : (
						<div className={styles.placeholder}>
							<User size={52} color="var(--muted-foreground)" strokeWidth={1} />
						</div>
					)}

					<div className={styles.gradient} />

					{coach.nationality && (
						<Flag className={styles.flagBadge} code={coach.nationality} aria-label={coach.nationality} />
					)}

					<div className={styles.nameplate}>
						<p className={styles.name}>
							<span className={styles.firstName}>{coach.first_name} </span>
							<span className={styles.lastName}>{coach.last_name}</span>
						</p>
					</div>
				</div>

				<div className={styles.statsStrip}>
					{(
						[
							{ label: 'G', value: coach.games },
							{ label: 'W', value: coach.wins },
							{ label: 'L', value: coach.losses },
							{ label: '%', value: coach.win_percentage },
						] as const
					).map(({ label, value }) => (
						<div key={label} className={styles.stat}>
							<span className={styles.statLabel}>{label}</span>
							<span className={styles.statValue}>{value ?? '–'}</span>
						</div>
					))}
				</div>
			</div>
		</Link>
	);
};

export default CoachCard;
