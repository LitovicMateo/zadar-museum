import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSeasons = () => {
	return useQuery({
		queryKey: ['dashboard', 'seasons'],
		queryFn: getAllSeasons
	});
};

const getAllSeasons = async (): Promise<string[]> => {
	const res = await axios.get(API_ROUTES.dashboard.seasons);

	return res.data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);
};
