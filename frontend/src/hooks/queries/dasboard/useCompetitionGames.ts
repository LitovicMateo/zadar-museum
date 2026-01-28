import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { GameDetailsResponse } from '@/types/api/game';

export const useCompetitionGames = (season: string, competition: string) => {
	return useQuery({
		queryKey: ['dashboard', 'games', season, competition],
		queryFn: getAllCompetitionSeasonGames.bind(null, season, competition),
		enabled: !!season && !!competition,
		errorMessage: 'Failed to load competition games'
	});
};

const getAllCompetitionSeasonGames = async (season: string, competition: string): Promise<GameDetailsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.dashboard.competitionGames(season, competition));

	return res.data;
};
