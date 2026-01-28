import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamCompetitionsResponse } from '@/types/api/team';

export const useTeamSeasonCompetitions = (teamName: string, season: string) => {
	return useQuery({
		queryKey: ['competitions', season, teamName],
		queryFn: getTeamSeasonCompetitions.bind(null, teamName, season),
		enabled: !!season,
		errorMessage: 'Failed to load season competitions'
	});
};

const getTeamSeasonCompetitions = async (teamName: string, season: string): Promise<TeamCompetitionsResponse[]> => {
	const params = new URLSearchParams({
		teamName,
		season
	});

	const res = await apiClient.get(API_ROUTES.team.competitions(params.toString()));

	return res.data as TeamCompetitionsResponse[];
};
