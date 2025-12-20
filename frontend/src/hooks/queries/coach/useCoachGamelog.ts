import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useCoachGamelog = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'gamelog', coachId, db],
		queryFn: getCoachGamelog.bind(null, coachId, db!),
		enabled: !!coachId && !!db
	});
};

const getCoachGamelog = async (coachId: string, db: PlayerDB): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.gamelog(coachId, db));

	return res.data;
};
