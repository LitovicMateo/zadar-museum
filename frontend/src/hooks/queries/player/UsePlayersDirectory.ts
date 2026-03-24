import { useMemo } from 'react';

import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/UsePlayerAllTimeStats';
import { PlayerDirectoryEntry } from '@/types/api/Player';

export function usePlayersDirectory() {
	const { data: players, isLoading: playersLoading } = usePlayers('last_name', 'asc');
	const { data: statsData, isLoading: statsLoading } = usePlayerAllTimeStats('zadar', 'total', 'all', 'all', 'all');
	const { data: averageStatsData, isLoading: averageStatsLoading } = usePlayerAllTimeStats(
		'zadar',
		'average',
		'all',
		'all',
		'all'
	);

	const allTimeStats = statsData?.current;

	const directory = useMemo<PlayerDirectoryEntry[] | undefined>(() => {
		if (!players || !allTimeStats) return undefined;

		const playersMap = new Map(players.map((p) => [String(p.documentId), p]));

		return averageStatsData?.current
			.map((stat) => {
				const player = playersMap.get(stat.player_id);
				if (!player) return null;
				return {
					id: player.id,
					documentId: player.documentId,
					first_name: player.first_name,
					last_name: player.last_name,
					primary_position: player.primary_position,
					secondary_position: player.secondary_position,
					nationality: player.nationality,
					height: player.height,
					isActivePlayer: player.is_active_player,
					image: player.image,
					games: stat.games ?? null,
					points: stat.points ?? null,
					rebounds: stat.rebounds ?? null,
					assists: stat.assists ?? null
				} as PlayerDirectoryEntry;
			})
			.filter((entry): entry is PlayerDirectoryEntry => entry !== null)
			.sort((a, b) => {
				const lastNameComparison = a.last_name.localeCompare(b.last_name);
				if (lastNameComparison !== 0) return lastNameComparison;
				return a.first_name.localeCompare(b.first_name);
			});
	}, [players, averageStatsData]);

	return {
		directory,
		allTimeStats,
		isLoading: playersLoading || statsLoading || averageStatsLoading
	};
}
