import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachRecordResponse } from '@/types/api/coach';

export const useCoachRecord = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'record', coachId, db],
		queryFn: getCoachRecord.bind(null, coachId, db!),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load coach record'
	});
};

const getCoachRecord = async (coachId: string, db: PlayerDB): Promise<CoachRecordResponse> => {
	const res = await apiClient.get(API_ROUTES.coach.record(coachId, db));

	return res.data;
};
