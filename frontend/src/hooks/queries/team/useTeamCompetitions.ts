import { API_ROUTES } from '@/constants/routes';
import { TeamCompetitionsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamCompetitions = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', 'competitions', teamSlug],
		queryFn: getTeamCompetitions.bind(null, teamSlug!),
		enabled: !!teamSlug
	});
};

const getTeamCompetitions = async (teamSlug: string): Promise<TeamCompetitionsResponse[]> => {
	const res = await axios.get(API_ROUTES.team.teamCompetitions(teamSlug));

	return res.data;
};
