import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { VenueDirectoryEntry } from '@/types/api/Venue';
import { getImageUrl } from '@/utils/GetImageUrl';
import { PinIcon } from 'lucide-react';

import styles from './VenueCard.module.css';

interface VenueCardProps {
	venue: VenueDirectoryEntry;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
	const imageUrl = venue.image?.url ? getImageUrl(venue.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.venue(venue.slug)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img src={imageUrl} alt={venue.name} className={styles.image} loading="lazy" />
				) : (
					// something to represent a venue - maybe a pin icon or a stadium silhouette
					<PinIcon size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
				{venue.nation && <Flag className={styles.flagBadge} code={venue.nation} aria-label={venue.nation} />}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>{venue.name}</div>

				<div className={styles.meta}>
					{venue.nation && <span className={styles.positionBadge}>{venue.nation}</span>}

					<span className={styles.dot} />
					<span>{venue.city}</span>
				</div>

				<div className={styles.stats}>
					<div className={styles.stat}>
						<span className={styles.statLabel}>G</span>
						<span className={styles.statValue}>{venue.games ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>W</span>
						<span className={styles.statValue}>{venue.wins ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>L</span>
						<span className={styles.statValue}>{venue.losses ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>%</span>
						<span className={styles.statValue}>{venue.win_percentage ?? '-'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default VenueCard;
