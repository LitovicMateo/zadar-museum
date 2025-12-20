import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useSeasons = () => {
	return useQuery({
		queryKey: ['dashboard', 'seasons'],
		queryFn: getAllSeasons
	});
};

const getAllSeasons = async (): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.dashboard.seasons);
	const raw = unwrapCollection<{ season: string }>(res as unknown as { data?: unknown });

	return raw.map((s) => s.season).sort((a: string, b: string) => +b - +a);
};
