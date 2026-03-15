import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamCompetitionsResponse } from '@/types/api/Team';

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
