import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSeasonLeagueStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-league-stats', coachId, season, db],
		queryFn: getSeasonLeagueStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db
	});
};

const getSeasonLeagueStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await axios.get(API_ROUTES.coach.seasonLeagueStats(coachId, season, db));

	console.log('RESPONSE LEAGUE', res.data);

	return res.data;
};
