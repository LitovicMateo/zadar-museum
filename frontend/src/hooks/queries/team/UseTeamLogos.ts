import { useMemo } from 'react';

import { StrapiImage } from '@/types/api/Strapi';

import { useTeams } from './UseTeams';

/**
 * Builds a `slug -> team logo` map from the teams directory so schedule cards can
 * resolve logos client-side without adding image data to the schedule payload.
 */
export const useTeamLogos = (): Map<string, StrapiImage> => {
	const { data: teams } = useTeams('short_name', 'asc');

	return useMemo(() => {
		const map = new Map<string, StrapiImage>();
		if (!teams) return map;
		for (const team of teams) {
			if (team.slug && team.image) map.set(team.slug, team.image);
		}
		return map;
	}, [teams]);
};
