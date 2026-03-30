import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';
import styles from './LeadersTable.module.css';

type LeadersTableProps = {
	teamLeaders: TeamLeaders[];
	selected: 'player' | 'coach';
	stat: string | null;
};

const LeadersTable: React.FC<LeadersTableProps> = ({ teamLeaders, selected, stat }) => {
	return (
		<div className={styles.wrapper}>
			<ul>
				<li className={styles.header}>
					<span>Player Name</span>
					<span>Statistic</span>
				</li>
				{teamLeaders?.map((leader, index) => {
					if (stat === null || leader[stat] === null || leader[stat] === '0') return null;

					const url = selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);
					return (
						<li
							className={`${styles.item} ${index === teamLeaders.length - 1 ? "" : styles.itemBorder}`}
						>
							<Link to={url}>
								{leader.first_name} {leader.last_name}
							</Link>
							<span className={styles.value}>{leader[stat]}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default LeadersTable;
