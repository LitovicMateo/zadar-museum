import { useMemo } from 'react';

import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { CompetitionDirectoryEntry } from '@/types/api/Competition';

import { useTeamLeagueStats } from '../team/UseTeamLeagueStats';

export const useCompetitionsDirectory = () => {
	const { data: competitions, isLoading: isLoadingCompetitions } = useCompetitions('slug', 'asc');
	const { data: teamStats, isLoading: isLoadingTeamStats } = useTeamLeagueStats('kk-zadar');

	const stats = useMemo(() => {
		if (!teamStats) return undefined;
		const statsMap = new Map(teamStats.map((s) => [String(s.total.league_id), s.total]));
		return statsMap;
	}, [teamStats]);

	const directory = useMemo<CompetitionDirectoryEntry[] | undefined>(() => {
		if (!competitions) return undefined;

		return competitions
			.map((comp) => {
				const teamStats = stats?.get(String(comp.documentId));
				return {
					id: comp.id,
					name: comp.name,
					short_name: comp.short_name,
					slug: comp.slug,
					alternate_names: comp.alternate_names,
					trophies: comp.trophies,
					documentId: comp.documentId,
					games: teamStats?.games || null,
					wins: teamStats?.wins || null,
					losses: teamStats?.losses || null,
					win_percentage: teamStats?.win_percentage || null
				} as CompetitionDirectoryEntry;
			})
			.sort((a, b) => a.short_name.localeCompare(b.short_name));
	}, [competitions, stats]);

	return {
		directory,
		isLoading: isLoadingCompetitions || isLoadingTeamStats
	};
};
