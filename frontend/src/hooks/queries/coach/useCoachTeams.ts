import { API_ROUTES } from '@/constants/routes';
import { PlayerTeamResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachTeams = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'teams', coachId],
		queryFn: getCoachTeams.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachTeams = async (coachId: string): Promise<PlayerTeamResponse[]> => {
	const res = await axios.get(API_ROUTES.coach.teams(coachId));

	return res.data;
};
