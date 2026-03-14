import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useLeaguePlayerRankings } from '@/hooks/queries/league/UseLeaguePlayerRankings';
import { PlayerAllTimeStats } from '@/types/api/Player';
import styles from './LeagueLeaderList.module.css';

const LeagueLeaderList: React.FC<{
	stat: keyof PlayerAllTimeStats;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: playerRankings } = useLeaguePlayerRankings(leagueSlug!, stat);

	return (
		<section>
			<ul className={styles.list}>
				<li className={styles.header}>
					<span>Statistic</span>
					<span>Record</span>
				</li>
				{playerRankings?.map((p) => (
					<li key={p.player_id} className={styles.item}>
						<div className={styles.itemInner}>
							<Link to={APP_ROUTES.player(p.player_id)}>
								{p.first_name} {p.last_name}
							</Link>
							<span>{p[stat]}</span>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default LeagueLeaderList;
