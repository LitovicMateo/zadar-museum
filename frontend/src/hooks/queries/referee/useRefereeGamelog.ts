import { API_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeGamelog = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'gamelog', refereeId],
		queryFn: getRefereeGamelog.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeGamelog = async (refereeId: string): Promise<TeamScheduleResponse[]> => {
	const res = await axios.get(API_ROUTES.referee.gamelog(refereeId));
	const data = res.data;

	return data;
};
