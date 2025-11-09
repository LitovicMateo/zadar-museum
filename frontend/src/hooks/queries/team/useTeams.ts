import { API_ROUTES } from '@/constants/routes';
import { TeamDetailsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type TeamKey = keyof TeamDetailsResponse;

export const useTeams = (sortKey?: TeamKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['teams', sortKey, direction],
		queryFn: getAllTeams.bind(null, sortKey, direction)
	});
};

const getAllTeams = async (sortKey?: TeamKey, direction: 'asc' | 'desc' = 'asc'): Promise<TeamDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await axios.get(API_ROUTES.dashboard.teams(params.toString()));

	return res.data;
};
