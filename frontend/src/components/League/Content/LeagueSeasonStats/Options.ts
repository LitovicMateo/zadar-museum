import { SeasonTeamRecords } from '@/types/api/Competition';

// Values match the backend column suffixes (`points_total` / `points_avg`).
export type LeaderMode = 'total' | 'avg';

export const LEADER_MODES: { value: LeaderMode; label: string }[] = [
	{ value: 'total', label: 'Total' },
	{ value: 'avg', label: 'Average' }
];

/**
 * Seasonal leader categories. `mode: true` categories switch between a
 * `_total` and `_avg` column; `games` is a plain count in both modes.
 */
export const LEADER_CATEGORIES: { base: string; label: string; mode: boolean }[] = [
	{ base: 'games', label: 'Games Played', mode: false },
	{ base: 'points', label: 'Points', mode: true },
	{ base: 'rebounds', label: 'Rebounds', mode: true },
	{ base: 'assists', label: 'Assists', mode: true },
	{ base: 'minutes', label: 'Minutes', mode: true },
	{ base: 'three_pointers_made', label: '3-Pointers Made', mode: true }
];

export const RECORD_CATEGORIES: { key: keyof SeasonTeamRecords; label: string }[] = [
	{ key: 'most_points', label: 'Most Points Scored' },
	{ key: 'least_points_allowed', label: 'Least Points Allowed' },
	{ key: 'most_threes', label: 'Most 3-Pointers' },
	{ key: 'largest_win', label: 'Largest Win' },
	{ key: 'highest_attendance', label: 'Highest Attendance' }
];
