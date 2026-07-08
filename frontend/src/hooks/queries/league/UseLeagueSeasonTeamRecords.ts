import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { SeasonTeamRecords } from '@/types/api/Competition';

export const useLeagueSeasonTeamRecords = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['league', 'season-team-records', leagueSlug, season],
		queryFn: async (): Promise<SeasonTeamRecords> => {
			const res = await apiClient.get(API_ROUTES.league.seasonTeamRecords(leagueSlug, season));
			return res.data;
		},
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load team records'
	});
};
