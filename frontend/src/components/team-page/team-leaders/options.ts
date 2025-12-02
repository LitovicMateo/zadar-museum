import { CoachStatsResponse } from '@/types/api/coach';
import { PlayerAllTimeStats } from '@/types/api/player';

export const playerOptions: {
	value: keyof PlayerAllTimeStats;
	label: string;
}[] = [
	{
		value: 'points',
		label: 'Points'
	},
	{
		value: 'rebounds',
		label: 'Rebounds'
	},
	{
		value: 'assists',
		label: 'Assists'
	},
	{
		value: 'steals',
		label: 'Steals'
	},
	{
		value: 'blocks',
		label: 'Blocks'
	},
	{
		value: 'three_pointers_made',
		label: '3PT Made'
	},
	{
		value: 'free_throws_made',
		label: 'FT Made'
	}
];

export const coachOptions: {
	value: keyof CoachStatsResponse['headCoach']['total'];
	label: string;
}[] = [
	{
		value: 'games',
		label: 'Games'
	},
	{
		value: 'wins',
		label: 'Wins'
	},
	{
		value: 'losses',
		label: 'Losses'
	},
	{
		value: 'win_percentage',
		label: 'Win %'
	},
	{
		value: 'points_scored',
		label: 'Avg Points Scored'
	},
	{
		value: 'points_received',
		label: 'Avg Points Received'
	},
	{
		value: 'points_difference',
		label: 'Avg Points Diff'
	}
];

export const playerKeys = playerOptions.map((o) => o.value);
export const coachKeys = coachOptions.map((o) => o.value);
