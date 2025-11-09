export type PositionOption = {
	value: string;
	label: string;
};

export const positionOptions: PositionOption[] = [
	{
		value: 'pg',
		label: 'Point Guard'
	},
	{
		value: 'sg',
		label: 'Shooting Guard'
	},
	{
		value: 'sf',
		label: 'Small Forward'
	},
	{
		value: 'pf',
		label: 'Power Forward'
	},
	{
		value: 'c',
		label: 'Center'
	}
];
