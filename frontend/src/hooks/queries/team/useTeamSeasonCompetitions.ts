import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
// type import removed - response transformed into simplified shape
import { useQuery } from '@tanstack/react-query';

export const useTeamSeasonCompetitions = (teamName: string, season: string) => {
	return useQuery({
		queryKey: ['competitions', season, teamName],
		queryFn: getTeamSeasonCompetitions.bind(null, teamName, season),
		enabled: !!season
	});
};

const getTeamSeasonCompetitions = async (
	teamId: string,
	season: string
): Promise<{ league_id: string; league_name: string; league_slug: string }[]> => {
	const params = `teamName=${encodeURIComponent(teamId)}&season=${encodeURIComponent(season)}`;
	const res = await apiClient.get<{ league_id: string; league_name: string; league_slug: string }[]>(
		API_ROUTES.team.competitions(params)
	);
	return res.data ?? [];
};
