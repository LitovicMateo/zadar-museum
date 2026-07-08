import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamPlayerAggStatsResponse } from '@/types/api/Team';

export type TeamPlayerScope = 'team' | 'main';
export type TeamPlayerStatsMode = 'total' | 'average';

export const useTeamPlayerSplitStats = (
	teamSlug: string,
	opts: { stats: TeamPlayerStatsMode; database: TeamPlayerScope; league?: string; season?: string; enabled?: boolean }
) => {
	const { stats, database, league, season, enabled = true } = opts;
	return useQuery({
		queryKey: ['team', 'player-split-stats', teamSlug, stats, database, league ?? '', season ?? ''],
		queryFn: async (): Promise<TeamPlayerAggStatsResponse> => {
			const res = await apiClient.get(
				API_ROUTES.team.playerSplitStats(teamSlug, { stats, database, league, season })
			);
			return res.data;
		},
		enabled: enabled && !!teamSlug,
		errorMessage: 'Failed to load team player stats'
	});
};
