import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useRefereeGamelog = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'gamelog', refereeId],
		queryFn: getRefereeGamelog.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeGamelog = async (refereeId: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.referee.gamelog(refereeId));
	const data = res.data;

	return data;
};
