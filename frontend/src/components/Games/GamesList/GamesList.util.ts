import { TeamScheduleResponse } from '@/types/api/Team';

export const groupGames = (schedule: TeamScheduleResponse[] | undefined, competitionSlug: string) => {
	const games = schedule?.filter((g) => g.league_id === competitionSlug) ?? [];

	// Bucket games by group_name (empty string = no group)
	const groups = new Map<string, typeof games>();
	for (const game of games) {
		const key = game.group_name || '';
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(game);
	}

	// Sort games within each group by round (numeric)
	for (const groupGames of groups.values()) {
		groupGames.sort((a, b) => +a.round - +b.round);
	}

	// Sort groups by the earliest game date in each group
	return [...groups.entries()].sort(([, aGames], [, bGames]) => {
		const aDate = Math.min(...aGames.map((g) => new Date(g.game_date).getTime()));
		const bDate = Math.min(...bGames.map((g) => new Date(g.game_date).getTime()));
		return aDate - bDate;
	});
};
