import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamScheduleResponse } from '@/types/api/team';

export const useCoachGamelog = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'gamelog', coachId, db],
		queryFn: getCoachGamelog.bind(null, coachId, db!),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load coach gamelog'
	});
};

const getCoachGamelog = async (coachId: string, db: PlayerDB): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.gamelog(coachId, db));

	return res.data;
};
