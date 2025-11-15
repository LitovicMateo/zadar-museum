import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useLeaguePlayerRankings } from '@/hooks/queries/league/useLeaguePlayerRankings';
import { PlayerAllTimeStats } from '@/types/api/player';

const LeagueLeaderList: React.FC<{
	stat: keyof PlayerAllTimeStats;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: playerRankings } = useLeaguePlayerRankings(leagueSlug!, stat);

	return (
		<section>
			<ul className="font-abel text-xl min-h-[500px]">
				<li className="flex justify-between border-b border-solid border-gray-500 px-2 py-2 font-semibold bg-slate-100">
					<span>Statistic</span>
					<span>Record</span>
				</li>
				{playerRankings?.map((p) => (
					<li key={p.player_id} className="text-base">
						<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b border-solid border-gray-500">
							<Link to={APP_ROUTES.player(p.player_id)}>
								{p.first_name} {p.last_name}
							</Link>
							<span className="">{p[stat]}</span>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default LeagueLeaderList;
