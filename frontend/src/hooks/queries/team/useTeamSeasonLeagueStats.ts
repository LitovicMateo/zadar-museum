import { API_ROUTES } from '@/constants/routes';
import { TeamStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamSeasonLeagueStats = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['season-stats', season, teamSlug],
		queryFn: getTeamSeasonLeagueStats.bind(null, season, teamSlug),
		enabled: !!season && !!teamSlug
	});
};

const getTeamSeasonLeagueStats = async (season: string, teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await axios.get(API_ROUTES.team.stats.seasonTotalStats(teamSlug!, season!));

	return res.data;
};
