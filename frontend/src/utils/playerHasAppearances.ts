import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { PlayerDB } from '@/pages/Player/Player';

export const usePlayerHasAppearances = (playerId: string, db: PlayerDB) => {
	const { data } = useAllTimeStats(playerId, db);

	if (!data) return null;

	const gamesPlayed = data[0].total.total.games;
	return gamesPlayed !== 0;
};
