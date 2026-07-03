import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';
import { User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { APP_ROUTES } from '@/constants/Routes';
import { PlayerDirectoryEntry } from '@/types/api/Player';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './PlayerCard.module.css';

interface PlayerCardProps {
	player: PlayerDirectoryEntry;
	isLeader?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isLeader }) => {
	const imageUrl = player.image?.url ? getImageUrl(player.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.player(player.documentId)} className={styles.cardLink}>
			<div className={styles.card}>
				{isLeader && <div className={styles.leaderBar} />}

				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img
							src={imageUrl}
							alt={`${player.first_name} ${player.last_name}`}
							className={styles.image}
							loading="lazy"
						/>
					) : (
						<div className={styles.placeholder}>
							<User size={52} color="var(--muted-foreground)" strokeWidth={1} />
						</div>
					)}

					<div className={styles.gradient} />

					{player.nationality && (
						<Flag className={styles.flagBadge} code={player.nationality} aria-label={player.nationality} />
					)}

					<div className={styles.nameplate}>
						<p className={styles.name}>
							<span className={styles.firstName}>{player.first_name} </span>
							<span className={styles.lastName}>{player.last_name}</span>
						</p>
						<div className={styles.meta}>
							{player.primary_position && (
								<Badge variant="outline" className={styles.posBadge}>
									{player.primary_position.toUpperCase()}
								</Badge>
							)}
							{player.secondary_position && (
								<Badge variant="outline" className={styles.posBadge}>
									{player.secondary_position.toUpperCase()}
								</Badge>
							)}
							{player.height && <span className={styles.height}>{player.height} cm</span>}
						</div>
					</div>
				</div>

				<div className={styles.statsStrip}>
					{(
						[
							{ label: 'GP', value: player.games },
							{ label: 'PTS', value: player.points },
							{ label: 'REB', value: player.rebounds },
							{ label: 'AST', value: player.assists },
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

export default PlayerCard;
