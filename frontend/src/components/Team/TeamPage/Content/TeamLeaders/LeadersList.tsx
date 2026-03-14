import { TeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import LeadersRow from './LeadersRow';

import styles from './LeadersList.module.css';

type LeadersListProps = {
	teamLeaders: TeamLeaders[];
	stat: string | null;
	selected: 'player' | 'coach';
};

const LeadersList = ({ teamLeaders, stat, selected }: LeadersListProps) => {
	const visibleLeaders = stat === null ? [] : teamLeaders.filter((leader) => leader[stat] !== null);

	return (
		<div className={styles.card}>
			<ul className={styles.list}>
				<li className={styles.header}>
					<span className={styles.headerCell}>Player Name</span>
					<span className={styles.headerCell}>Statistic</span>
				</li>
				{visibleLeaders.map((leader, index) => (
					<LeadersRow
						key={leader.id}
						leader={leader}
						stat={stat!}
						selected={selected}
						isLast={index === visibleLeaders.length - 1}
					/>
				))}
			</ul>
		</div>
	);
};

export default LeadersList;
