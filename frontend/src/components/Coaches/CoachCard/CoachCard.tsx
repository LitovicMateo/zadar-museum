import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { CoachDirectoryEntry } from '@/types/api/Coach';
import { getImageUrl } from '@/utils/GetImageUrl';
import { User } from 'lucide-react';

import styles from './CoachCard.module.css';

interface CoachCardProps {
	coach: CoachDirectoryEntry;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
	const imageUrl = coach.image?.url ? getImageUrl(coach.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	console.log(coach);

	return (
		<Link to={APP_ROUTES.coach(coach.documentId)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img
						src={imageUrl}
						alt={`${coach.first_name} ${coach.last_name}`}
						className={styles.image}
						loading="lazy"
					/>
				) : (
					<User size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
				{coach.nationality && (
					<Flag className={styles.flagBadge} code={coach.nationality} aria-label={coach.nationality} />
				)}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>
					<span className={styles.firstName}>{coach.first_name} </span>
					{coach.last_name}
				</div>

				<div className={styles.stats}>
					<div className={styles.stat}>
						<span className={styles.statLabel}>G</span>
						<span className={styles.statValue}>{coach.games ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>W</span>
						<span className={styles.statValue}>{coach.wins ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>%</span>
						<span className={styles.statValue}>{coach.win_percentage ?? '-'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default CoachCard;
