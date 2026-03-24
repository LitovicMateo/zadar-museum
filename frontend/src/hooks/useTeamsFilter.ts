import { useMemo } from 'react';

import { TeamDirectoryEntry } from '@/types/api/Team';
import { searchTeams } from '@/utils/SearchFunctions';

export function useTeamsFilter(teams: TeamDirectoryEntry[] | undefined, searchTerm: string) {
	const filtered = useMemo(() => {
		if (!teams) return undefined;

		let result = searchTeams(teams as never[], searchTerm) as unknown as TeamDirectoryEntry[];

		return result;
	}, [teams, searchTerm]);

	return filtered;
}
