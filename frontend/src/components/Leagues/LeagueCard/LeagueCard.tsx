import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

import { APP_ROUTES } from '@/constants/Routes';
import { CompetitionDirectoryEntry } from '@/types/api/Competition';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './LeagueCard.module.css';

interface LeagueCardProps {
	league: CompetitionDirectoryEntry;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
	const imageUrl = league.logo?.url ? getImageUrl(league.logo.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.league(league.slug)} className={styles.cardLink}>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img src={imageUrl} alt={league.name} className={styles.image} loading="lazy" />
					) : (
						<div className={styles.placeholder}>
							<Trophy size={52} strokeWidth={1} opacity={0.4} />
						</div>
					)}
				</div>

				<div className={styles.body}>
					<p className={styles.name}>{league.name}</p>
				</div>

				<div className={styles.statsStrip}>
					{[
						{ label: 'G', value: league.games },
						{ label: 'W', value: league.wins },
						{ label: 'L', value: league.losses },
					].map(({ label, value }) => (
						<div key={label} className={styles.stat}>
							<span className={styles.statLabel}>{label}</span>
							<span className={styles.statValue}>{value ?? '–'}</span>
						</div>
					))}
					<div className={styles.stat}>
						<span className={styles.statLabel}>
							<Trophy size={10} strokeWidth={1.5} />
						</span>
						<span className={styles.statValue}>{league.trophies.length ?? '–'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default LeagueCard;
