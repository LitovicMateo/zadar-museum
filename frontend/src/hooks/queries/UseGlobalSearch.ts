import { keepPreviousData, useQuery } from '@tanstack/react-query';

import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export interface SearchResults {
	players: { documentId: string; first_name: string; last_name: string }[];
	teams: { documentId: string; name: string; slug: string }[];
	coaches: { documentId: string; first_name: string; last_name: string }[];
	venues: { documentId: string; name: string; slug: string }[];
	referees: { documentId: string; first_name: string; last_name: string }[];
	competitions: { documentId: string; name: string; slug: string }[];
}

export function useGlobalSearch(term: string) {
	return useQuery<SearchResults>({
		queryKey: ['global-search', term],
		queryFn: () => apiClient.get<SearchResults>(API_ROUTES.search(term)).then((r) => r.data),
		enabled: term.trim().length > 1,
		staleTime: 30_000,
		placeholderData: keepPreviousData
	});
}
