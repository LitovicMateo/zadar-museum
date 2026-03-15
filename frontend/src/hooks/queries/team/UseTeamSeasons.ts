import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamSeasonsResponse } from '@/types/api/Team';

export const useTeamSeasons = (teamSlug: string) => {
	return useQuery<string[]>({
		queryKey: ['seasons', teamSlug],
		queryFn: getTeamSeasons.bind(null, teamSlug!),
		enabled: !!teamSlug,
		errorMessage: 'Failed to load team seasons'
	});
};

const getTeamSeasons = async (slug: string): Promise<TeamSeasonsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.seasons(slug));

	const seasons = res.data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);

	return seasons;
};
