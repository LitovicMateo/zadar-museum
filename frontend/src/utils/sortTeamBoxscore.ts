import { PlayerBoxscoreResponse } from '@/types/api/player';

const statusOrder: Record<string, number> = {
	starter: 0,
	bench: 1
	// anything starting with "dnp" gets lowest priority
};

export function sortTeamBoxscore(players?: PlayerBoxscoreResponse[]) {
	if (!players) return [];
	return [...players].sort((a, b) => {
		const statusA = statusOrder[a.status] ?? 2; // treat dnp as 2
		const statusB = statusOrder[b.status] ?? 2;

		if (statusA !== statusB) {
			return statusA - statusB;
		}

		// sort by shirt_number as number
		return Number(a.shirt_number) - Number(b.shirt_number);
	});
}
