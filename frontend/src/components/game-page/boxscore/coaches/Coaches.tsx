import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useGameTeamCoaches } from '@/hooks/queries/game/UseGameTeamCoaches';
import styles from './Coaches.module.css';

type CoachesProps = {
	teamSlug: string;
};

const Coaches: React.FC<CoachesProps> = ({ teamSlug }) => {
	const { gameId } = useParams();

	const { data: coaches, isLoading } = useGameTeamCoaches(gameId!, teamSlug);

	if (isLoading || !coaches) return null;

	return (
		<div className={styles.wrapper}>
			{coaches.coach && (
				<Link
					to={APP_ROUTES.coach(coaches.coach.documentId)}
					className={styles.link}
				>
					<div className={styles.info}>
						<span className={styles.role}>Head Coach</span>
						<span className={styles.name}>
							{coaches?.coach.first_name} {coaches?.coach.last_name}
						</span>
					</div>
				</Link>
			)}
			{coaches.assistantCoach && (
				<Link
					to={APP_ROUTES.coach(coaches.assistantCoach.documentId)}
					className={styles.link}
				>
					<div className={styles.info}>
						<span className={styles.role}>Assistant Coach</span>
						<span className={styles.name}>
							{coaches?.assistantCoach?.first_name} {coaches?.assistantCoach?.last_name}
						</span>
					</div>
				</Link>
			)}
		</div>
	);
};

export default Coaches;
