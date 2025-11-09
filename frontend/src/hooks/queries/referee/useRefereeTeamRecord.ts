import { API_ROUTES } from '@/constants/routes';
import { RefereeStatsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeTeamRecord = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'team-record', refereeId],
		queryFn: getRefereeTeamRecord.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeTeamRecord = async (refereeId: string): Promise<RefereeStatsResponse> => {
	const res = await axios.get(API_ROUTES.referee.teamRecord(refereeId));
	return res.data;
};
