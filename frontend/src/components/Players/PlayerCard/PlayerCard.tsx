import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { PlayerDirectoryEntry } from '@/types/api/Player';
import { getImageUrl } from '@/utils/GetImageUrl';
import { User } from 'lucide-react';

import styles from './PlayerCard.module.css';

interface PlayerCardProps {
	player: PlayerDirectoryEntry;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
	const imageUrl = player.image?.url ? getImageUrl(player.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	console.log(player);

	return (
		<Link to={APP_ROUTES.player(player.documentId)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img
						src={imageUrl}
						alt={`${player.first_name} ${player.last_name}`}
						className={styles.image}
						loading="lazy"
					/>
				) : (
					<User size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
				{player.nationality && (
					<Flag className={styles.flagBadge} code={player.nationality} aria-label={player.nationality} />
				)}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>
					<span className={styles.firstName}>{player.first_name} </span>
					{player.last_name}
				</div>

				<div className={styles.meta}>
					{player.primary_position && <span className={styles.positionBadge}>{player.primary_position}</span>}
					{player.secondary_position && (
						<>
							<span className={styles.dot} />
							<span className={styles.positionBadge}>{player.secondary_position}</span>
						</>
					)}
					{player.height && (
						<>
							<span className={styles.dot} />
							<span>{player.height} cm</span>
						</>
					)}
				</div>

				<div className={styles.stats}>
					<div className={styles.stat}>
						<span className={styles.statLabel}>GP</span>
						<span className={styles.statValue}>{player.games ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>PTS</span>
						<span className={styles.statValue}>{player.points ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>REB</span>
						<span className={styles.statValue}>{player.rebounds ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>AST</span>
						<span className={styles.statValue}>{player.assists ?? '-'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default PlayerCard;
