import NoContent from '@/components/NoContent/NoContent';
import { Podium } from '@/components/UI/Podium';
import { RankingsList } from '@/components/UI/RankingsList';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueCoachRankings } from '@/hooks/queries/league/UseLeagueCoachRankings';
import { CoachStatsRanking } from '@/types/api/Coach';

const formatValue = (stat: keyof CoachStatsRanking, value: number): string => {
	if (stat === 'win_percentage') return `${value.toFixed(1)}%`;
	return String(value);
};

const LeagueCoachLeaderList: React.FC<{
	stat: keyof CoachStatsRanking;
	leagueSlug: string | undefined;
}> = ({ leagueSlug, stat }) => {
	const { data: coachRankings } = useLeagueCoachRankings(leagueSlug!, stat);

	if (coachRankings && coachRankings.length === 0) {
		return <NoContent type="info" description="No ranking data available for this league." />;
	}

	const items = (coachRankings ?? []).slice(0, 20).map((c) => ({
		id: c.coach_id,
		name: `${c.first_name} ${c.last_name}`,
		to: APP_ROUTES.coach(c.coach_id),
		value: formatValue(stat, c[stat] as number)
	}));

	const top3 = items.slice(0, 3);
	const rest = items.slice(3);

	return (
		<div className="space-y-4">
			<Podium items={top3} eyebrow="All-time leader" ariaLabel="Top coach rankings" />
			{rest.length > 0 && <RankingsList items={rest} startRank={4} />}
		</div>
	);
};

export default LeagueCoachLeaderList;
