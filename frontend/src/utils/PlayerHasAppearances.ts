import { PlayerDB } from '@/components/Player/PlayerPage';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';

export const usePlayerHasAppearances = (playerId: string, db: PlayerDB) => {
	const { data } = useAllTimeStats(playerId, db);

	if (!data) return null;

	const gamesPlayed = data[0].total.total.games;
	return gamesPlayed !== 0;
};
