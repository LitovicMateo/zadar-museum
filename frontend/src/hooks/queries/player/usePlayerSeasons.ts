import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerSeasonsResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerSeasons = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['seasons', playerId, db],
		queryFn: getPlayerSeasons.bind(null, playerId, db)
	});
};

const getPlayerSeasons = async (playerId: string, db: PlayerDB): Promise<PlayerSeasonsResponse> => {
	const res = await apiClient.get(API_ROUTES.player.seasons(playerId, db));
	const raw = unwrapCollection<{ season: string }>(res as unknown as { data?: unknown });
	const seasons = raw.map((s) => s.season).sort((a: string, b: string) => +b - +a);

	return seasons;
};
