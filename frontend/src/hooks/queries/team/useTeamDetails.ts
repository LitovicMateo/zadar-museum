import { API_ROUTES } from '@/constants/routes';
import { TeamDetailsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamDetails = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', teamSlug],
		queryFn: getSingleTeam.bind(null, teamSlug),
		enabled: !!teamSlug
	});
};

const getSingleTeam = async (slug: string): Promise<TeamDetailsResponse> => {
	const res = await axios.get(API_ROUTES.team.details(slug));

	const raw = res.data.data[0];
	return raw;
};
