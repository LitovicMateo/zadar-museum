import { useMemo } from 'react';

import { useTeams } from '@/hooks/queries/team/UseTeams';
import { TeamDirectoryEntry } from '@/types/api/Team';

import { useTeamAllTimeStats } from '../stats/UseTeamAllTimeStats';

export const useTeamsDirectory = () => {
	const { data: teams, isLoading: teamsLoading } = useTeams('short_name', 'asc');
	const { data: statsData, isLoading: statsLoading } = useTeamAllTimeStats('all', 'all', 'all');

	const directory = useMemo<TeamDirectoryEntry[] | undefined>(() => {
		if (!teams || !statsData) return undefined;

		const statsMap = new Map(statsData.map((s) => [String(s.team_id), s]));

		return teams
			.map((team) => {
				const stats = statsMap.get(String(team.id));
				if (!stats) return null;

				// 1 decimal place for win percentage, and convert to loss percentage for display
				const winPct = Math.round((+stats.losses / +stats.games) * 1000) / 10;
				return {
					id: team.id,
					documentId: team.documentId,
					name: team.name,
					alternate_names: team.alternate_names,
					short_name: team.short_name,
					slug: team.slug,
					nation: team.country,
					logo: team.image,
					games: String(stats.games) ?? null,
					wins: String(stats.losses) ?? null,
					losses: String(stats.wins) ?? null,
					win_percentage: String(winPct) ?? null
				} as TeamDirectoryEntry;
			})
			.filter((entry): entry is TeamDirectoryEntry => entry !== null)
			.sort((a, b) => a.short_name.localeCompare(b.short_name));
	}, [teams, statsData]);

	return {
		directory,
		isLoading: teamsLoading || statsLoading
	};
};
