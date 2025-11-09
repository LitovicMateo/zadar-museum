import { API_ROUTES } from '@/constants/routes';
import { TeamStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamTotalStats = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', 'head2head', teamSlug],
		queryFn: getTeamTotalStats.bind(null, teamSlug!),
		enabled: !!teamSlug
	});
};

const getTeamTotalStats = async (teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await axios.get(API_ROUTES.team.stats.total(teamSlug));

	return res.data;
};
