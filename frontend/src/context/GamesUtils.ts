import { TeamScheduleResponse } from '@/types/api/Team';
import { searchGames } from '@/utils/SearchFunctions';

export const ALL_COMPETITIONS = 'all';

/**
 * Filters a flat schedule by competition (single value or ALL_COMPETITIONS) and by
 * opponent-only search term. Ordering is handled downstream by buildScheduleSections.
 */
export const filterSchedule = (
	schedule: TeamScheduleResponse[] | undefined,
	selectedCompetition: string = ALL_COMPETITIONS,
	searchTerm = '',
	perspectiveSlug?: string
): TeamScheduleResponse[] => {
	if (!schedule || schedule.length === 0) return [];

	return schedule.filter((game) => {
		if (selectedCompetition !== ALL_COMPETITIONS && String(game.league_id) !== selectedCompetition) {
			return false;
		}
		if (searchTerm.trim().length > 0) {
			return searchGames(game, searchTerm, perspectiveSlug);
		}
		return true;
	});
};
