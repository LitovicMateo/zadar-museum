import { API_ROUTES } from '@/constants/routes';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamStats = (key: keyof TeamStatsResponse, sort: 'asc' | 'desc') => {
	return useQuery({
		queryKey: ['team-stats', key, sort],
		queryFn: getTeamStats.bind(null, key, sort)
	});
};

const getTeamStats = async (key: keyof TeamStatsResponse, sort: 'asc' | 'desc'): Promise<TeamStatsResponse[]> => {
	const params = new URLSearchParams({
		sort: key.toString(),
		direction: sort
	});

	const res = await axios.get(API_ROUTES.dashboard.teamStats(params.toString()));

	return res.data;
};
