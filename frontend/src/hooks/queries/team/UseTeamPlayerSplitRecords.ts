import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamPlayerSplitRecordsResponse } from '@/types/api/Team';

import type { TeamPlayerScope } from './UseTeamPlayerSplitStats';

export const useTeamPlayerSplitRecords = (
	teamSlug: string,
	opts: { statKey: string; database: TeamPlayerScope; league?: string; season?: string; enabled?: boolean }
) => {
	const { statKey, database, league, season, enabled = true } = opts;
	return useQuery({
		queryKey: ['team', 'player-split-records', teamSlug, statKey, database, league ?? '', season ?? ''],
		queryFn: async (): Promise<TeamPlayerSplitRecordsResponse> => {
			const res = await apiClient.get(
				API_ROUTES.team.playerSplitRecords(teamSlug, { statKey, database, league, season })
			);
			return res.data;
		},
		enabled: enabled && !!teamSlug && !!statKey,
		errorMessage: 'Failed to load team player records'
	});
};
