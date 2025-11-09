import { API_ROUTES } from '@/constants/routes';
import { CoachDetailsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachDetails = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', coachId],
		queryFn: getCoachDetails.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachDetails = async (coachId: string): Promise<CoachDetailsResponse> => {
	const res = await axios.get(API_ROUTES.coach.details(coachId));

	return res.data;
};
