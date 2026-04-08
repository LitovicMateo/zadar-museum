import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import styles from './LeadersRow.module.css';

type LeadersRowProps = {
	leader: TeamLeaders;
	stat: string;
	selected: 'player' | 'coach';
	isLast: boolean;
};

const LeadersRow = ({ leader, stat, selected, isLast }: LeadersRowProps) => {
	const url = selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);

	return (
		<li key={leader.id} className={`${styles.item} ${isLast ? '' : styles.itemBorder}`}>
			<Link to={url} className={styles.link}>
				{leader.first_name} {leader.last_name}
			</Link>
			<span className={styles.value}>{leader[stat]}</span>
		</li>
	);
};

export default LeadersRow;
