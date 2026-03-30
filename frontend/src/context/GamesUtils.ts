import { TeamScheduleResponse } from '@/types/api/Team';
import { searchGames } from '@/utils/SearchFunctions';

const compareGames = (a: TeamScheduleResponse, b: TeamScheduleResponse): number => {
const aIsPlayoff = a.stage === 'playoff';
const bIsPlayoff = b.stage === 'playoff';

// Both league/group: sort by round numerically, fall back to date
if (!aIsPlayoff && !bIsPlayoff) {
const roundA = parseInt(a.round, 10);
const roundB = parseInt(b.round, 10);
if (!isNaN(roundA) && !isNaN(roundB)) return roundA - roundB;
return new Date(a.game_date).getTime() - new Date(b.game_date).getTime();
}

// At least one is playoff (or mixed): sort chronologically by date
return new Date(a.game_date).getTime() - new Date(b.game_date).getTime();
};

export const filterSchedule = (
schedule: TeamScheduleResponse[] | undefined,
selectedCompetitions: string[] = [],
searchTerm = '',
isZadar = false
): TeamScheduleResponse[] => {
if (!schedule || schedule.length === 0) return [];

const selectedSet = new Set(selectedCompetitions.map(String));
const hasCompetitionFilter = selectedCompetitions.length > 0;

return schedule
.filter((game) => {
const leagueId = String(game.league_id);
const matchesCompetition = !hasCompetitionFilter || selectedSet.has(leagueId);
if (!matchesCompetition) return false;

if (isZadar && searchTerm && searchTerm.trim().length > 0) {
return Boolean(searchGames(game, searchTerm));
}

return true;
})
.sort(compareGames);
};
