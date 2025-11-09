import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachRecord = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'record', coachId, db],
		queryFn: getCoachRecord.bind(null, coachId, db!),
		enabled: !!coachId && !!db
	});
};

const getCoachRecord = async (coachId: string, db: PlayerDB): Promise<CoachStatsResponse> => {
	const res = await axios.get(API_ROUTES.coach.record(coachId, db));

	return res.data;
};
