import { useMemo } from 'react';

import { CoachDirectoryEntry } from '@/types/api/Coach';
import { searchCoaches } from '@/utils/SearchFunctions';

export type RoleFilter = 'all' | 'head' | 'assistant';

export function useCoachesFilters(
	coaches: CoachDirectoryEntry[] | undefined,
	searchTerm: string,
	role: RoleFilter = 'all',
	setRole: (value: RoleFilter) => void
) {
	const filtered = useMemo(() => {
		if (!coaches) return undefined;

		// Text search — searchCoaches expects CoachResponse-shaped objects (first_name + last_name)
		let result = searchCoaches(coaches as never[], searchTerm) as unknown as CoachDirectoryEntry[];

		return result;
	}, [coaches, searchTerm]);

	const clearFilters = () => {
		setRole('all');
	};

	const hasActiveFilters = role !== 'all';

	return {
		filtered,
		role,
		setRole,
		clearFilters,
		hasActiveFilters
	};
}
