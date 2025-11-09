import { API_ROUTES } from '@/constants/routes';
import { GameDetailsResponse } from '@/types/api/game';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCompetitionGames = (season: string, competition: string) => {
	return useQuery({
		queryKey: ['dashboard', 'games', season, competition],
		queryFn: getAllCompetitionSeasonGames.bind(null, season, competition),
		enabled: !!season && !!competition
	});
};

const getAllCompetitionSeasonGames = async (season: string, competition: string): Promise<GameDetailsResponse[]> => {
	const res = await axios.get(API_ROUTES.dashboard.competitionGames(season, competition));

	return res.data;
};
