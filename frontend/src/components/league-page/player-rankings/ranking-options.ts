import { PlayerAllTimeStats } from '@/types/api/player';

export const rankingOptions: {
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
		label: '3 Pointers Made'
	}
];
