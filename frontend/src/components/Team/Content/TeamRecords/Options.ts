export const playerRecordOptions = [
	{ value: 'points', label: 'Points' },
	{ value: 'rebounds', label: 'Rebounds' },
	{ value: 'assists', label: 'Assists' },
	{ value: 'steals', label: 'Steals' },
	{ value: 'blocks', label: 'Blocks' },
	{ value: 'three_pointers_made', label: '3PT Made' },
	{ value: 'free_throws_made', label: 'FT Made' },
	{ value: 'field_goals_made', label: 'FG Made' },
	{ value: 'plus_minus', label: '+/-' },
	{ value: 'efficiency', label: 'Efficiency' }
] as const;

export const teamRecordOptions = [
	{ value: 'score', label: 'Score' },
	{ value: 'field_goals_made', label: 'FG Made' },
	{ value: 'three_pointers_made', label: '3PT Made' },
	{ value: 'free_throws_made', label: 'FT Made' },
	{ value: 'rebounds', label: 'Rebounds' },
	{ value: 'assists', label: 'Assists' },
	{ value: 'steals', label: 'Steals' },
	{ value: 'blocks', label: 'Blocks' }
] as const;

export type RecordsVariant = 'player' | 'team';

export const RECORDS_VARIANTS = {
	player: { options: playerRecordOptions, nameLabel: 'Player' },
	team: { options: teamRecordOptions, nameLabel: 'Opponent' }
} as const;
