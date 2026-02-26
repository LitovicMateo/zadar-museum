import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereeStats } from '@/types/api/referee';

export const useRefereeSeasonStats = (refereeId: string | undefined, season: string) => {
	return useQuery({
		queryKey: ['seasonStats', refereeId, season],
		queryFn: getRefereeSeasonStats.bind(null, refereeId, season),
		enabled: !!refereeId,
		errorMessage: 'Failed to load season statistics'
	});
};

const getRefereeSeasonStats = async (refereeId: string | undefined, season: string): Promise<RefereeStats[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasonStats(refereeId!, season));

	const data = res.data;

	return data;
};
