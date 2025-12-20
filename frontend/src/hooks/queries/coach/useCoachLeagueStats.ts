import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useCoachLeagueStats = (coachId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['coach', 'league-stats', coachId, db],
		queryFn: getCoachLeagueStats.bind(null, coachId, db),
		enabled: !!coachId && !!db
	});
};

const getCoachLeagueStats = async (coachId: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.leagueStats(coachId, db));

	return res.data;
};
