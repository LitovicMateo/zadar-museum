import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamSeasonsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamSeasons = (teamSlug: string) => {
	return useQuery<string[]>({
		queryKey: ['seasons', teamSlug],
		queryFn: getTeamSeasons.bind(null, teamSlug!),
		enabled: !!teamSlug
	});
};

const getTeamSeasons = async (slug: string): Promise<TeamSeasonsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.seasons(slug));

	const seasons = res.data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);

	return seasons;
};
