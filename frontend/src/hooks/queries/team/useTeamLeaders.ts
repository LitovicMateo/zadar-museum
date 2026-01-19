import { playerKeys, coachKeys } from '@/components/team-page/team-leaders/options';
import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerAllTimeStats } from '@/types/api/player';

export type TeamLeaders = {
	id: string;
	first_name: string;
	last_name: string;
	[key: string]: string | number;
};

export const useTeamLeaders = (
	teamSlug: string,
	db: 'coach' | 'player',
	stat: string | null,
	competitionSlug?: string
) => {
	const isValidKey =
		!!stat &&
		((db === 'player' && stat != null && playerKeys.includes(stat as keyof PlayerAllTimeStats)) ||
			// coachKeys comes from options and is typed to keys of CoachStatsResponse headCoach/total
			(db === 'coach' && stat != null && coachKeys.includes(stat as unknown as (typeof coachKeys)[number])));

	return useQuery({
		queryKey: ['team', 'leaders', db, stat, teamSlug, competitionSlug],
		queryFn: getTeamLeaders.bind(null, teamSlug, db, stat!, competitionSlug),
		enabled: !!teamSlug && isValidKey,
		errorMessage: 'Failed to load team leaders'
	});
};

const getTeamLeaders = async (
	teamSlug: string,
	db: 'coach' | 'player',
	stat: string,
	competitionSlug?: string
): Promise<TeamLeaders[]> => {
	const params = new URLSearchParams();
	params.append('team', teamSlug);
	params.append('db', db);
	params.append('statKey', stat);

	if (competitionSlug) {
		params.append('competitionSlug', competitionSlug);
	}

	const res = await apiClient.get(API_ROUTES.team.stats.leaders(params.toString()));

	return res.data;
};
