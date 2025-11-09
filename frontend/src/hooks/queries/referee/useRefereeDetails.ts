import { API_ROUTES } from '@/constants/routes';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeDetails = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', refereeId],
		queryFn: getRefereeDetails.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeDetails = async (refereeId: string): Promise<RefereeDetailsResponse> => {
	const res = await axios.get(API_ROUTES.referee.details(refereeId));
	const data = res.data.data;

	return data;
};
