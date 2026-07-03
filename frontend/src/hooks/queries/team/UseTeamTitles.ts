import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

export type TitleEntry = {
	short_name: string;
	slug: string;
	count: number;
	mostRecentYear: number;
};

const getTeamTitles = async (): Promise<TitleEntry[]> => {
	const res = await apiClient.get('/api/competitions');
	const raw: CompetitionDetailsResponse[] = res.data?.data ?? [];

	return raw
		.filter((comp) => comp.trophies?.length > 0)
		.map((comp) => ({
			short_name: comp.short_name,
			slug: comp.slug,
			count: comp.trophies.length,
			mostRecentYear: Math.max(...comp.trophies.map(Number))
		}))
		.sort((a, b) => b.count - a.count || b.mostRecentYear - a.mostRecentYear);
};

export const useTeamTitles = () => {
	return useQuery({
		queryKey: ['team', 'titles'],
		queryFn: getTeamTitles,
		errorMessage: 'Failed to load team titles'
	});
};
