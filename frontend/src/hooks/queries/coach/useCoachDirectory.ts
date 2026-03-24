import { useMemo } from 'react';

import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/UseCoachAllTimeStats';
import { RoleFilter } from '@/hooks/useCoachesFilters';
import { CoachDirectoryEntry } from '@/types/api/Coach';

export const useCoachesDirectory = (role: RoleFilter = 'all') => {
	const { data: coaches, isLoading: coachesLoading } = useCoaches('last_name', 'asc');
	const { data: statsData, isLoading: statsLoading } = useCoachAllTimeStats('zadar', role, 'all', 'all', 'all');

	const allTimeStats = statsData?.current;

	const directory = useMemo<CoachDirectoryEntry[] | undefined>(() => {
		if (!coaches || !allTimeStats) return undefined;

		const coachesMap = new Map(coaches.map((c) => [String(c.documentId), c]));

		return allTimeStats
			.map((stat) => {
				const coach = coachesMap.get(stat.coach_id);
				if (!coach) return null;
				return {
					id: coach.id,
					documentId: coach.documentId,
					first_name: coach.first_name,
					last_name: coach.last_name,
					games: stat.games ?? null,
					wins: stat.wins ?? null,
					losses: stat.losses ?? null,
					win_percentage: stat.win_percentage ?? null
				} as CoachDirectoryEntry;
			})
			.filter((entry): entry is CoachDirectoryEntry => entry !== null)
			.sort((a, b) => {
				const lastNameComparison = a.last_name.localeCompare(b.last_name);
				if (lastNameComparison !== 0) return lastNameComparison;
				return a.first_name.localeCompare(b.first_name);
			});
	}, [coaches, allTimeStats]);

	return {
		directory,
		allTimeStats,
		isLoading: coachesLoading || statsLoading
	};
};
