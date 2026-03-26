import { useMemo } from 'react';

import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { RefereeDirectoryEntry } from '@/types/api/Referee';

import { useRefereeAllTimeStats } from '../stats/UseRefereeAllTimeStats';

export const useRefereesDirectory = () => {
	const { data: referees, isLoading: isLoadingReferees } = useReferees('last_name', 'asc');
	const { data: allTimeStats, isLoading: isLoadingAllTimeStats } = useRefereeAllTimeStats('all', 'all', 'all');

	const directory = useMemo<RefereeDirectoryEntry[] | undefined>(() => {
		if (!referees || isLoadingAllTimeStats) return undefined;

		const statsMap = new Map(allTimeStats ? allTimeStats.map((s) => [String(s.referee_document_id), s]) : []);

		return referees.map((referee) => {
			const stats = statsMap.get(referee.documentId);

			return {
				id: referee.id,
				document_id: referee.documentId,
				name: `${referee.first_name} ${referee.last_name}`,
				first_name: referee.first_name,
				last_name: referee.last_name,
				image: referee.image,
				nation: referee.nationality ?? null,
				games: stats?.games ?? null,
				fouls_for: stats?.fouls_for?.toFixed(1) ?? null,
				fouls_against: stats?.fouls_against?.toFixed(1) ?? null,
				foul_difference_best: stats?.foul_difference?.toFixed(1) ?? null,
				foul_difference_worst: stats?.foul_difference?.toFixed(1) ?? null
			};
		});
	}, [referees, allTimeStats, isLoadingAllTimeStats]);

	return {
		directory,
		stats: allTimeStats,
		isLoading: isLoadingReferees || isLoadingAllTimeStats
	};
};
