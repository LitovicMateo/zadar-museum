import { API_ROUTES } from '@/constants/routes';
import { LeagueStats } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useLeagueTeamRecord = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'team-record', leagueSlug],
		queryFn: getCompetitionTeamRecord.bind(null, leagueSlug),
		enabled: !!leagueSlug
	});
};

const getCompetitionTeamRecord = async (competitionSlug: string): Promise<LeagueStats> => {
	const res = await axios.get(API_ROUTES.league.teamRecord(competitionSlug));

	const data = res.data;

	return data;
};
