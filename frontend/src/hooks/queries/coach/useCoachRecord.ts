import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { CoachRecordResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useCoachRecord = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'record', coachId, db],
		queryFn: getCoachRecord.bind(null, coachId, db!),
		enabled: !!coachId && !!db
	});
};

const getCoachRecord = async (coachId: string, db: PlayerDB): Promise<CoachRecordResponse> => {
	const res = await apiClient.get<CoachRecordResponse>(API_ROUTES.coach.record(coachId, db));

	return unwrapSingle<CoachRecordResponse>(res as unknown as { data?: unknown }) as CoachRecordResponse;
};
