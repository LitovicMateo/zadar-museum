import { playerKeys, coachKeys } from '@/components/team-page/team-leaders/options';
import { API_ROUTES } from '@/constants/routes';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
		((db === 'player' && playerKeys.includes(stat as keyof PlayerAllTimeStats)) ||
			// coachKeys comes from options and already typed to keys of CoachStatsResponse headCoach/total
			(db === 'coach' && coachKeys.includes(stat as any)));

	return useQuery({
		queryKey: ['team', 'leaders', db, stat, teamSlug, competitionSlug],
		queryFn: getTeamLeaders.bind(null, teamSlug, db, stat!, competitionSlug),
		enabled: !!teamSlug && isValidKey
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

	const res = await axios.get(API_ROUTES.team.stats.leaders(params.toString()));

	return res.data;
};
