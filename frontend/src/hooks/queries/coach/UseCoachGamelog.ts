import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

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
