import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';

import Category from '../../../pages/Stats/Category';
import Container from '../../../pages/Stats/Container';

type StatsFilterProps = {
	stats?: 'total' | 'average';
	setStats?: (stats: 'total' | 'average') => void;
};

const statsOptions: { label: string; value: 'total' | 'average' }[] = [
	{
		label: 'Total',
		value: 'total'
	},
	{
		label: 'Average',
		value: 'average'
	}
];

const StatsFilter: React.FC<StatsFilterProps> = ({ setStats, stats }) => {
	return (
		<Container>
			<Category>Stats</Category>
			<Select
				styles={selectStyle()}
				value={statsOptions.find((opt) => opt.value === stats)}
				onChange={(opt) => setStats!((opt?.value as 'total' | 'average') ?? 'total')}
				options={statsOptions}
			/>
		</Container>
	);
};

export default StatsFilter;
