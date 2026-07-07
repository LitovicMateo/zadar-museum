import NoContent from '@/components/NoContent/NoContent';
import { Podium } from '@/components/UI/Podium';
import { RankingsList } from '@/components/UI/RankingsList';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeaguePlayerRankings } from '@/hooks/queries/league/UseLeaguePlayerRankings';
import { PlayerAllTimeStats } from '@/types/api/Player';

const LeagueLeaderList: React.FC<{
	stat: keyof PlayerAllTimeStats;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: playerRankings } = useLeaguePlayerRankings(leagueSlug!, stat);

	if (playerRankings && playerRankings.length === 0) {
		return <NoContent type="info" description="No ranking data available for this league." />;
	}

	const items = (playerRankings ?? []).slice(0, 20).map((p) => ({
		id: p.player_id,
		name: `${p.first_name} ${p.last_name}`,
		to: APP_ROUTES.player(p.player_id),
		value: p[stat]
	}));

	const top3 = items.slice(0, 3);
	const rest = items.slice(3);

	return (
		<div className="space-y-4">
			<Podium items={top3} eyebrow="All-time leader" ariaLabel="Top player rankings" />
			{rest.length > 0 && <RankingsList items={rest} startRank={4} />}
		</div>
	);
};

export default LeagueLeaderList;
