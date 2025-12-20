import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { RefereeStats } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';

export const useRefereeSeasonStats = (refereeId: string | undefined, season: string) => {
	return useQuery({
		queryKey: ['seasonStats', refereeId, season],
		queryFn: getRefereeSeasonStats.bind(null, refereeId, season),
		enabled: !!refereeId
	});
};

const getRefereeSeasonStats = async (refereeId: string | undefined, season: string): Promise<RefereeStats[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasonStats(refereeId!, season));

	const data = res.data;

	return data;
};
