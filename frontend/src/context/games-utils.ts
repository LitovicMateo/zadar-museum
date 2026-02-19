import { TeamScheduleResponse } from '@/types/api/team';
import { searchGames } from '@/utils/search-functions';

export const filterSchedule = (
	schedule: TeamScheduleResponse[] | undefined,
	selectedCompetitions: string[] = [],
	searchTerm = '',
	isZadar = false
): TeamScheduleResponse[] => {
	if (!schedule || schedule.length === 0) return [];

	const selectedSet = new Set(selectedCompetitions.map(String));
	const hasCompetitionFilter = selectedCompetitions.length > 0;

	return schedule.filter((game) => {
		const leagueId = String(game.league_id);
		const matchesCompetition = !hasCompetitionFilter || selectedSet.has(leagueId);
		if (!matchesCompetition) return false;

		if (isZadar && searchTerm && searchTerm.trim().length > 0) {
			return Boolean(searchGames(game, searchTerm));
		}

		return true;
	});
};
