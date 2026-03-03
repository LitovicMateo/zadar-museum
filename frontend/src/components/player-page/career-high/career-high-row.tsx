import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { Stat } from '@/types/api/player';

import styles from './career-high-row.module.css';

type CareerHighRowProps = {
	label: string;
	stat: Stat;
	isLastItem: boolean;
};

const CareerHighRow: React.FC<CareerHighRowProps> = ({ label, stat, isLastItem }) => {
	const { data: team } = useTeamDetails(stat.opponent_team_slug!);

	return (
		<li className={[styles.row, !isLastItem ? styles.rowBordered : ''].join(' ')}>
			<Link to={APP_ROUTES.game(stat.game_id)} className={styles.link}>
				<div>{label}</div>
				<div className={styles.statInfo}>
					<span className={styles.statValue}>{stat.stat_value}</span>
					<span className={styles.statMeta}>
						vs {team?.short_name} ({stat.game_date})
					</span>
				</div>
			</Link>
		</li>
	);
};

export default CareerHighRow;
