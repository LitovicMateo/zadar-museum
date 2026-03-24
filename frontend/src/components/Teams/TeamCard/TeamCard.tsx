import React from 'react';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamDirectoryEntry } from '@/types/api/Team';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Shield } from 'lucide-react';

import styles from './TeamCard.module.css';

interface TeamCardProps {
	team: TeamDirectoryEntry;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
	const imageUrl = team.logo?.url ? getImageUrl(team.logo.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	console.log(team);

	return (
		<Link to={APP_ROUTES.team(team.slug)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img src={imageUrl} alt={team.name} className={styles.image} loading="lazy" />
				) : (
					<Shield size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
				{team.nation && <Flag className={styles.flagBadge} code={team.nation} aria-label={team.nation} />}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>{team.name}</div>

				<div className={styles.stats}>
					<div className={styles.stat}>
						<span className={styles.statLabel}>G</span>
						<span className={styles.statValue}>{team.games ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>W</span>
						<span className={styles.statValue}>{team.wins ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>L</span>
						<span className={styles.statValue}>{team.losses ?? '-'}</span>
					</div>
					<div className={styles.stat}>
						<span className={styles.statLabel}>%</span>
						<span className={styles.statValue}>{team.win_percentage ?? '-'}</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TeamCard;
