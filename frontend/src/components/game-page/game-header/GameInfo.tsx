import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { Calendar1, MapPin, Trophy, Users } from 'lucide-react';
import getRoundLabel from './game-info.utils';
import styles from './GameInfo.module.css';

const GameInfo: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game || isLoading) return null;

	const date = new Date(game.date).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });

	return (
		<div className={styles.wrapper}>
			<div className={styles.grid}>
				<Link
					to={APP_ROUTES.league(game.competition.slug)}
					className={styles.cell}
				>
					<div className={`${styles.icon} ${styles.iconBlue}`}>
						<Trophy size={16} className="text-blue-600" />
					</div>
					<div className={styles.iconText}>
						<span className={styles.iconLabel}>Competition</span>
						<span className={styles.iconValue}>
							{game.league_name}
						</span>
						<span className={styles.iconSub}>{getRoundLabel(game.stage, game.round, game.group_name)}</span>
					</div>
				</Link>

				<Link
					to={APP_ROUTES.venue(game.venue.slug)}
					className={styles.cell}
				>
					<div className={`${styles.icon} ${styles.iconGreen}`}>
						<MapPin size={16} className="text-green-600" />
					</div>
					<div className={styles.iconText}>
						<span className={styles.iconLabel}>Venue</span>
						<span className={styles.iconValue}>
							{game.venue.name}
						</span>
						<span className={styles.iconSub}>{game.venue.city}</span>
					</div>
				</Link>

				<div className={styles.cell}>
					<div className={`${styles.icon} ${styles.iconPurple}`}>
						<Calendar1 size={16} className="text-purple-600" />
					</div>
					<div className={styles.iconText}>
						<span className={styles.iconLabel}>Date</span>
						<span className={styles.iconValue}>{date}</span>
					</div>
				</div>

				<div className={styles.cell}>
					<div className={`${styles.icon} ${styles.iconOrange}`}>
						<Users size={16} className="text-orange-600" />
					</div>
					<div className={styles.iconText}>
						<span className={styles.iconLabel}>Attendance</span>
						<span className={styles.iconValue}>{game.attendance}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameInfo;
