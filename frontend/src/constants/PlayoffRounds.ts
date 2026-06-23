/**
 * Playoff round codes stored in `game.round` when `game.stage === 'playoff'`.
 * Mirrors the options in forms/game/Fields/Round.tsx. `order` drives the
 * display sequence (earliest stage first).
 */
export type PlayoffRoundCode = 'R64' | 'R32' | 'R16' | 'QF' | 'SF' | '3RD' | 'F';

export const PLAYOFF_ROUNDS: { code: PlayoffRoundCode; label: string; order: number }[] = [
	{ code: 'R64', label: 'Round of 64', order: 0 },
	{ code: 'R32', label: 'Round of 32', order: 1 },
	{ code: 'R16', label: 'Round of 16', order: 2 },
	{ code: 'QF', label: 'Quarter-finals', order: 3 },
	{ code: 'SF', label: 'Semi-finals', order: 4 },
	{ code: '3RD', label: 'Third place', order: 5 },
	{ code: 'F', label: 'Final', order: 6 }
];

const ROUND_MAP = new Map(PLAYOFF_ROUNDS.map((r) => [r.code, r]));

export const playoffRoundLabel = (code: string): string => ROUND_MAP.get(code as PlayoffRoundCode)?.label ?? code;

export const playoffRoundOrder = (code: string): number =>
	ROUND_MAP.get(code as PlayoffRoundCode)?.order ?? Number.MAX_SAFE_INTEGER;
