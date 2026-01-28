import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useSeasons = () => {
	return useQuery({
		queryKey: ['dashboard', 'seasons'],
		queryFn: getAllSeasons,
		errorMessage: 'Failed to load seasons'
	});
};

const getAllSeasons = async (): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.dashboard.seasons);

	return res.data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);
};
