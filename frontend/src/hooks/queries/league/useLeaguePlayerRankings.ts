import { API_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useLeaguePlayerRankings = (leagueSlug: string, stat: string) => {
	return useQuery({
		queryKey: ['league', 'player-rankings', leagueSlug, stat],
		queryFn: getCompetitionPlayerRankings.bind(null, leagueSlug, stat),
		enabled: !!leagueSlug
	});
};

const getCompetitionPlayerRankings = async (competitionSlug: string, stat: string): Promise<PlayerAllTimeStats[]> => {
	const res = await axios.get(API_ROUTES.league.playerRankings(competitionSlug, stat));
	return res.data;
};
