import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { VenueDirectoryEntry } from '@/types/api/Venue';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './VenueCard.module.css';

interface VenueCardProps {
	venue: VenueDirectoryEntry;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
	const imageUrl = venue.image?.url ? getImageUrl(venue.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.venue(venue.slug)} className={styles.cardLink}>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img src={imageUrl} alt={venue.name} className={styles.image} loading="lazy" />
					) : (
						<div className={styles.placeholder}>
							<MapPin size={52} strokeWidth={1} opacity={0.4} />
						</div>
					)}

					<div className={styles.gradient} />

					{venue.nation && (
						<Flag className={styles.flagBadge} code={venue.nation} aria-label={venue.nation} />
					)}

					<div className={styles.nameplate}>
						<p className={styles.name}>{venue.name}</p>
						{venue.city && <p className={styles.city}>{venue.city}</p>}
					</div>
				</div>

				<div className={styles.statsStrip}>
					{(
						[
							{ label: 'G', value: venue.games },
							{ label: 'W', value: venue.wins },
							{ label: 'L', value: venue.losses },
							{ label: '%', value: venue.win_percentage },
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

export default VenueCard;
