import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachStatsResponse } from '@/types/api/Coach';

export const useSeasonLeagueStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-league-stats', coachId, season, db],
		queryFn: getSeasonLeagueStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load season league statistics'
	});
};

const getSeasonLeagueStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.seasonLeagueStats(coachId, season, db));

	return res.data;
};
