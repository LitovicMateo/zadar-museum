import { API_ROUTES } from '@/constants/routes';
// import type removed: we transform backend response to {id, slug}
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useTeamCompetitions = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', 'competitions', teamSlug],
		queryFn: getTeamCompetitions.bind(null, teamSlug!),
		enabled: !!teamSlug,
		errorMessage: 'Failed to load team competitions'
	});
};

type LeaguePair = { id: string; slug: string };

const getTeamCompetitions = async (teamSlug: string): Promise<LeaguePair[]> => {
	const res = await apiClient.get(API_ROUTES.team.teamCompetitions(teamSlug));

	const raw = res.data;
	if (!Array.isArray(raw)) return [];
	const data = raw as Array<Record<string, unknown>>;

	const seen = new Set<string>();
	const uniques: LeaguePair[] = [];

	for (const item of data) {
		// backend returns snake_case fields like league_id / league_slug
		const id = String(item['league_id'] ?? item['leagueId'] ?? item['id'] ?? '');
		const slug = String(item['league_slug'] ?? item['leagueSlug'] ?? item['slug'] ?? '');
		const key = `${id}::${slug}`;
		if (!id) continue; // skip empty ids
		if (!seen.has(key)) {
			seen.add(key);
			uniques.push({ id, slug });
		}
	}

	return uniques;
};
