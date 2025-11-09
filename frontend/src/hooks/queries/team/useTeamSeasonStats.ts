import { API_ROUTES } from '@/constants/routes';
import { TeamStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamSeasonStats = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['season-league-stats', season, teamSlug],
		queryFn: getTeamSeasonStats.bind(null, season, teamSlug),
		enabled: !!season && !!teamSlug
	});
};

const getTeamSeasonStats = async (season: string, teamSlug: string): Promise<TeamStatsResponse[]> => {
	const res = await axios.get(API_ROUTES.team.stats.seasonLeagueStats(teamSlug!, season!));

	return res.data;
};
