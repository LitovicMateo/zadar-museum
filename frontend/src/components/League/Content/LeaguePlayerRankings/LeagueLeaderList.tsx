import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useLeaguePlayerRankings } from '@/hooks/queries/league/UseLeaguePlayerRankings';
import { PlayerAllTimeStats } from '@/types/api/Player';

import styles from './LeagueLeaderList.module.css';

const MEDAL_CLASS: Record<number, string> = {
	0: styles.gold,
	1: styles.silver,
	2: styles.bronze
};

const LeagueLeaderList: React.FC<{
	stat: keyof PlayerAllTimeStats;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: playerRankings } = useLeaguePlayerRankings(leagueSlug!, stat);

	if (playerRankings && playerRankings.length === 0) {
		return <div className={styles.empty}>No ranking data available for this league.</div>;
	}

	return (
		<section>
			<ul className={styles.list}>
				<li className={styles.header}>
					<span>#</span>
					<span>Player</span>
					<span>Record</span>
				</li>
				{playerRankings?.map((p, index) => (
					<li key={p.player_id} className={`${styles.item} ${MEDAL_CLASS[index] ?? ''}`}>
						<div className={styles.itemInner}>
							<span className={styles.rank}>{index + 1}</span>
							<span className={styles.name}>
								<Link to={APP_ROUTES.player(p.player_id)}>
									{p.first_name} {p.last_name}
								</Link>
							</span>
							<span className={styles.statValue}>{p[stat]}</span>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default LeagueLeaderList;
