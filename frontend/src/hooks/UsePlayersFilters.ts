import { useMemo, useState } from 'react';

import { PlayerDirectoryEntry } from '@/types/api/Player';
import { searchPlayers } from '@/utils/SearchFunctions';

export type PositionFilter = string | 'all';
export type StatusFilter = 'all' | 'active' | 'retired';

export function usePlayersFilters(players: PlayerDirectoryEntry[] | undefined, searchTerm: string) {
	const [position, setPosition] = useState<PositionFilter>('all');
	const [status, setStatus] = useState<StatusFilter>('all');

	const filtered = useMemo(() => {
		if (!players) return undefined;

		// Text search — searchPlayers expects PlayerResponse-shaped objects (first_name + last_name)
		let result = searchPlayers(players as never[], searchTerm) as unknown as PlayerDirectoryEntry[];

		if (position !== 'all') {
			result = result.filter(
				(p) =>
					p.primary_position?.toLowerCase() === position.toLowerCase() ||
					p.secondary_position?.toLowerCase() === position.toLowerCase()
			);
		}

		if (status === 'active') {
			result = result.filter((p) => p.isActivePlayer);
		} else if (status === 'retired') {
			result = result.filter((p) => !p.isActivePlayer);
		}

		return result;
	}, [players, searchTerm, position, status]);

	const clearFilters = () => {
		setPosition('all');
		setStatus('all');
	};

	const hasActiveFilters = position !== 'all' || status !== 'all';

	return {
		filtered,
		position,
		setPosition,
		status,
		setStatus,
		clearFilters,
		hasActiveFilters
	};
}
