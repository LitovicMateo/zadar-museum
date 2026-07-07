import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { SeasonPlayerLeader } from '@/types/api/Competition';

export const useLeagueSeasonLeaders = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['league', 'season-leaders', leagueSlug, season],
		queryFn: async (): Promise<SeasonPlayerLeader[]> => {
			const res = await apiClient.get(API_ROUTES.league.seasonLeaders(leagueSlug, season));
			return res.data;
		},
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load seasonal leaders'
	});
};
