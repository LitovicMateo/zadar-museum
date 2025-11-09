import { API_ROUTES } from '@/constants/routes';
import { TeamCompetitionsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamSeasonCompetitions = (teamName: string, season: string) => {
	return useQuery({
		queryKey: ['competitions', season, teamName],
		queryFn: getTeamSeasonCompetitions.bind(null, teamName, season),
		enabled: !!season
	});
};

const getTeamSeasonCompetitions = async (teamName: string, season: string): Promise<TeamCompetitionsResponse[]> => {
	const params = new URLSearchParams({
		teamName,
		season
	});

	const res = await axios.get(API_ROUTES.team.competitions(params.toString()));

	return res.data as TeamCompetitionsResponse[];
};
