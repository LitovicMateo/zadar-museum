import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSeasonCompetitions = (season: string) => {
	return useQuery({
		queryKey: ['dashboard', 'competitions', season],
		queryFn: getAllCompetitionsInSeason.bind(null, season),
		enabled: !!season
	});
};

const getAllCompetitionsInSeason = async (
	season: string
): Promise<{ league_id: string; league_name: string; competition_slug: string }[]> => {
	const res = await axios.get(API_ROUTES.dashboard.seasonCompetitions(season));

	return res.data;
};
