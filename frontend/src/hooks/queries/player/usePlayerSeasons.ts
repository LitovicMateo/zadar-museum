import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
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
	const seasons = res.data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);

	return seasons;
};
