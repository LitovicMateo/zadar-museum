import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useSeasonCompetitions = (season: string) => {
	return useQuery({
		queryKey: ['dashboard', 'competitions', season],
		queryFn: getAllCompetitionsInSeason.bind(null, season),
		enabled: !!season,
		errorMessage: 'Failed to load season competitions'
	});
};

const getAllCompetitionsInSeason = async (
	season: string
): Promise<{ league_id: string; league_name: string; competition_slug: string }[]> => {
	const res = await apiClient.get(API_ROUTES.dashboard.seasonCompetitions(season));

	return res.data;
};
