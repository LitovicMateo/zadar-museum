import { playoffRoundLabel, playoffRoundOrder } from '@/constants/PlayoffRounds';
import { TeamScheduleResponse } from '@/types/api/Team';

export type ScheduleItem = {
	game: TeamScheduleResponse;
	/** Label shown on the card (e.g. "Round 5", "Game 2"); empty for single knockout games. */
	roundLabel: string;
};

export type ScheduleSection = {
	kind: 'league' | 'group' | 'playoff';
	key: string;
	/** Subheading above the games (group name or playoff stage); league sections have none. */
	heading?: string;
	items: ScheduleItem[];
};

export type CompetitionGroup = {
	leagueId: string;
	leagueName: string;
	leagueShortName?: string;
	sections: ScheduleSection[];
};

const byDate = (a: TeamScheduleResponse, b: TeamScheduleResponse) =>
	new Date(a.game_date).getTime() - new Date(b.game_date).getTime();

const byRound = (a: TeamScheduleResponse, b: TeamScheduleResponse) => {
	const ra = parseInt(a.round, 10);
	const rb = parseInt(b.round, 10);
	if (!isNaN(ra) && !isNaN(rb)) return ra - rb;
	return byDate(a, b);
};

const earliest = (games: TeamScheduleResponse[]) =>
	Math.min(...games.map((g) => new Date(g.game_date).getTime()));

/**
 * Turns one competition's games into ordered sections:
 *   league  -> single section, round shown per card
 *   group   -> one section per group_name (subheading), round per card
 *   playoff -> one section per stage code; a stage with >1 game is a series ("Game N")
 * Ordering: league first, then groups (by earliest date), then playoff stages (by stage order).
 */
export const buildScheduleSections = (games: TeamScheduleResponse[]): ScheduleSection[] => {
	const league = games.filter((g) => g.stage === 'league');
	const group = games.filter((g) => g.stage === 'group');
	const playoff = games.filter((g) => g.stage === 'playoff');

	const sections: ScheduleSection[] = [];

	if (league.length > 0) {
		sections.push({
			kind: 'league',
			key: 'league',
			items: [...league].sort(byRound).map((game) => ({ game, roundLabel: `Round ${game.round}` }))
		});
	}

	if (group.length > 0) {
		const groups = new Map<string, TeamScheduleResponse[]>();
		for (const g of group) {
			const key = g.group_name || '';
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(g);
		}
		const groupSections = [...groups.entries()]
			.sort(([, a], [, b]) => earliest(a) - earliest(b))
			.map(([groupName, gs]) => ({
				kind: 'group' as const,
				key: `group:${groupName || '_'}`,
				heading: groupName ? (groupName.length > 1 ? groupName : `Group ${groupName}`) : undefined,
				items: [...gs].sort(byRound).map((game) => ({ game, roundLabel: `Round ${game.round}` }))
			}));
		sections.push(...groupSections);
	}

	if (playoff.length > 0) {
		const stages = new Map<string, TeamScheduleResponse[]>();
		for (const g of playoff) {
			const key = g.round || '';
			if (!stages.has(key)) stages.set(key, []);
			stages.get(key)!.push(g);
		}
		const playoffSections = [...stages.entries()]
			.sort(([a], [b]) => playoffRoundOrder(a) - playoffRoundOrder(b))
			.map(([code, gs]) => {
				const ordered = [...gs].sort(byDate);
				const isSeries = ordered.length > 1;
				return {
					kind: 'playoff' as const,
					key: `playoff:${code}`,
					heading: playoffRoundLabel(code),
					items: ordered.map((game, i) => ({ game, roundLabel: isSeries ? `Game ${i + 1}` : '' }))
				};
			});
		sections.push(...playoffSections);
	}

	return sections;
};

/** Groups a flat schedule into competitions (ordered by earliest game), each with its sections. */
export const groupByCompetition = (
	schedule: TeamScheduleResponse[] | undefined
): CompetitionGroup[] => {
	if (!schedule || schedule.length === 0) return [];

	const comps = new Map<string, TeamScheduleResponse[]>();
	for (const g of schedule) {
		const id = String(g.league_id);
		if (!comps.has(id)) comps.set(id, []);
		comps.get(id)!.push(g);
	}

	return [...comps.entries()]
		.sort(([, a], [, b]) => earliest(a) - earliest(b))
		.map(([leagueId, games]) => ({
			leagueId,
			leagueName: games[0].league_name,
			leagueShortName: games[0].league_short_name,
			sections: buildScheduleSections(games)
		}));
};
