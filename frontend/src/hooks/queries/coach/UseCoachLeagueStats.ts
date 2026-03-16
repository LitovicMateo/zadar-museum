import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachStatsResponse } from '@/types/api/Coach';

export const useCoachLeagueStats = (coachId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['coach', 'league-stats', coachId, db],
		queryFn: getCoachLeagueStats.bind(null, coachId, db),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load coach league statistics'
	});
};

const getCoachLeagueStats = async (coachId: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.leagueStats(coachId, db));

	return res.data;
};
