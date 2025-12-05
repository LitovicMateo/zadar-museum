import { API_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerLeagueStats = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['player', 'league', 'stats', leagueSlug, season],
		queryFn: getSinglePlayerLeagueStats.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season
	});
};

const getSinglePlayerLeagueStats = async (leagueSlug: string, season: string): Promise<PlayerAllTimeStats[]> => {
	const res = await axios.get(API_ROUTES.league.playerSeasonStats(leagueSlug, season));

	console.log(res);

	const data = res.data;

	return data;
};
