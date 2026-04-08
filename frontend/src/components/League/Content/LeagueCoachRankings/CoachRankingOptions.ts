import { CoachStatsRanking } from '@/types/api/Coach';

export const coachRankingOptions: {
	value: keyof CoachStatsRanking;
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
		label: 'Win Percentage'
	},
	{
		value: 'points_scored',
		label: 'Points Scored'
	},
	{
		value: 'points_received',
		label: 'Points Received'
	},
	{
		value: 'points_difference',
		label: 'Points Difference'
	}
];
