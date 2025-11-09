import { API_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSeasonSchedule = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['games', 'schedule', season],
		queryFn: fetchSchedule.bind(null, season, teamSlug),
		enabled: !!season
	});
};

const fetchSchedule = async (season: string, teamSlug: string): Promise<TeamScheduleResponse[]> => {
	const res = await axios.get(API_ROUTES.team.schedule(season, teamSlug));

	return res.data;
};
