import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useRefereeSeasons = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'seasons', refereeId],
		queryFn: getRefereeSeasons.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeSeasons = async (refereeId: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasons(refereeId));
	const raw = unwrapCollection<unknown>(res as unknown as { data?: unknown });

	if (raw.length > 0 && typeof raw[0] === 'object' && raw[0] !== null) {
		const first = raw[0] as Record<string, unknown>;
		if ('season' in first) return raw.map((s) => (s as { season: string }).season);
	}

	return raw as string[];
};
