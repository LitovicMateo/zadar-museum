import { API_ROUTES } from '@/constants/routes';
import { PlayerTeamResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerTeams = (playerId: string) => {
	return useQuery({
		queryKey: ['player-teams', playerId],
		queryFn: getPlayerTeams.bind(null, playerId),
		enabled: !!playerId
	});
};

const getPlayerTeams = async (playerId: string): Promise<PlayerTeamResponse[]> => {
	const res = await axios.get(API_ROUTES.player.teams(playerId));

	return res.data;
};
