import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { CompetitionDirectoryEntry } from '@/types/api/Competition';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Trophy } from 'lucide-react';

import styles from './LeagueCard.module.css';

interface LeagueCardProps {
	league: CompetitionDirectoryEntry;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
	const imageUrl = league.logo?.url ? getImageUrl(league.logo.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	console.log(league);

	return (
		<Link to={APP_ROUTES.league(league.slug)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img src={imageUrl} alt={league.name} className={styles.image} loading="lazy" />
				) : (
					<Trophy size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>{league.name}</div>

				<div className={styles.stats}>
					<div className={styles.stat}>
						<span className={styles.statLabel}>G</span>
						<span className={styles.statValue}>{league.games ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>W</span>
						<span className={styles.statValue}>{league.wins ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>L</span>
						<span className={styles.statValue}>{league.losses ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>
							<Trophy size={16} color="var(--muted-foreground)" strokeWidth={1} />
						</span>
						<span className={styles.statValue}>{league.trophies.length ?? '-'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default LeagueCard;
