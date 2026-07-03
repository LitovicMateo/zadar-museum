import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star } from 'lucide-react';
import Flag from 'react-world-flags';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamDirectoryEntry } from '@/types/api/Team';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './TeamCard.module.css';

interface TeamCardProps {
	team: TeamDirectoryEntry;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
	const imageUrl = team.logo?.url ? getImageUrl(team.logo.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.team(team.slug)} className={styles.cardLink}>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img src={imageUrl} alt={team.name} className={styles.image} loading="lazy" />
					) : (
						<div className={styles.placeholder}>
							<Shield size={52} strokeWidth={1} opacity={0.4} />
						</div>
					)}

					{team.nation && (
						<Flag className={styles.flagBadge} code={team.nation} aria-label={team.nation} />
					)}

					{team.isMainTeam && (
						<div className={styles.mainTeamBadge} aria-label="Main team" title="Main team">
							<Star size={10} fill="currentColor" />
						</div>
					)}
				</div>

				<div className={styles.body}>
					<p className={styles.name}>{team.name}</p>
				</div>

				<div className={styles.statsStrip}>
					{(
						[
							{ label: 'G', value: team.games },
							{ label: 'W', value: team.wins },
							{ label: 'L', value: team.losses },
							{ label: '%', value: team.win_percentage },
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

export default TeamCard;
