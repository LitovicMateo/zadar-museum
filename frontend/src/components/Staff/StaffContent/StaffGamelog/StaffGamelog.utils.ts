import { TeamScheduleResponse } from '@/types/api/Team';

export function deriveSeasons(gamelog: TeamScheduleResponse[]): string[] {
	return [...new Set(gamelog.map((g) => g.season))].sort((a, b) => +b - +a);
}

export function deriveCompetitions(gamelog: TeamScheduleResponse[]) {
	const seen = new Set<string>();
	return gamelog.filter((g) => {
		const key = String(g.league_id);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
