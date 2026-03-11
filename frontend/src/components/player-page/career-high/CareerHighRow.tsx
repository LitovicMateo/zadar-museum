import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { Stat } from '@/types/api/Player';

import styles from './CareerHighRow.module.css';

type CareerHighRowProps = {
	label: string;
	stat: Stat;
};

const CareerHighRow: React.FC<CareerHighRowProps> = ({ label, stat }) => {
	const { data: team } = useTeamDetails(stat.opponent_team_slug!);

	return (
		<Link to={APP_ROUTES.game(stat.game_id)} className={styles.card}>
			<div className={styles.label}>{label}</div>
			<div className={styles.value}>{stat.stat_value}</div>
			<div className={styles.meta}>
				<span>vs {team?.short_name}</span>
				<span className={styles.metaDot} aria-hidden="true" />
				<span>{stat.game_date}</span>
			</div>
		</Link>
	);
};

export default CareerHighRow;
