import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamStatsRanking } from '@/types/api/Team';

import styles from './TeamLeaders.module.css';

const LEADER_CATEGORIES = [
	{ key: 'games', label: 'Games Played' },
	{ key: 'losses', label: 'Wins' },
	{ key: 'wins', label: 'Losses' },
	{ key: 'win_pct', label: 'Win Percentage' }
] as const;

type StatKey = (typeof LEADER_CATEGORIES)[number]['key'];

const TOP_N = 5;

interface TeamLeadersProps {
	stats: TeamStatsRanking[] | undefined;
}

const TeamLeaders: React.FC<TeamLeadersProps> = ({ stats }) => {
	const leadersByCategory = useMemo(() => {
		if (!stats) return null;

		return LEADER_CATEGORIES.map(({ key, label }) => {
			if (key === 'win_pct') {
				// For win percentage, we want to sort in ascending order to get the lowest percentages
				// If teams have the same win percentage, we can further sort by games played to break ties (more games = more impressive)
				const sorted = [...stats]
					.sort((a, b) => {
						if (+a[key] === +b[key]) {
							return +b.games - +a.games;
						}
						return +a[key] - +b[key];
					})
					.slice(0, TOP_N);

				// Deduct win_pct from 100 to get the loss percentage for display
				sorted.forEach((team) => {
					(team as any).win_pct = 100 - Number(team.win_pct);
				});
				return { key, label, leaders: sorted };
			}
			const sorted = [...stats].sort((a, b) => +b[key] - +a[key]).slice(0, TOP_N);
			return { key, label, leaders: sorted };
		});
	}, [stats]);

	if (!leadersByCategory) return null;

	return (
		<aside className={styles.sidebar}>
			<h3 className={styles.title}>Leaders</h3>
			{leadersByCategory.map(({ key, label, leaders }) => (
				<div key={key} className={styles.category}>
					<h4 className={styles.categoryTitle}>{label}</h4>
					<ol className={styles.list}>
						{leaders.map((team, index) => (
							<li key={team.team_id} className={styles.row}>
								<span className={styles.rank}>{index + 1}</span>
								<Link to={APP_ROUTES.team(team.team_slug)} className={styles.teamName}>
									{team.team_name}
								</Link>
								<span className={styles.statValue}>{team[key as StatKey].toLocaleString()}</span>
							</li>
						))}
					</ol>
				</div>
			))}
		</aside>
	);
};

export default TeamLeaders;
