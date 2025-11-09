import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachGamelog = (coachId: string, db: PlayerDB | null) => {
	return useQuery({
		queryKey: ['coach', 'gamelog', coachId, db],
		queryFn: getCoachGamelog.bind(null, coachId, db!),
		enabled: !!coachId && !!db
	});
};

const getCoachGamelog = async (coachId: string, db: PlayerDB): Promise<TeamScheduleResponse[]> => {
	const res = await axios.get(API_ROUTES.coach.gamelog(coachId, db));

	return res.data;
};
