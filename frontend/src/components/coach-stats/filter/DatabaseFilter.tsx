import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { PlayerDB } from '@/pages/Player/Player';
import Category from '@/pages/Stats/Category';
import Container from '@/pages/Stats/Container';

type DatabaseFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;
};

const databaseOptions: { label: string; value: PlayerDB }[] = [
	{
		label: 'Zadar',
		value: 'zadar'
	},
	{
		label: 'Opponents',
		value: 'opponent'
	}
];

const DatabaseFilter: React.FC<DatabaseFilterProps> = ({ database, setDatabase }) => {
	return (
		<Container>
			<Category>Database</Category>
			<Select
				styles={selectStyle()}
				value={databaseOptions.find((opt) => opt.value === database)}
				onChange={(opt) => setDatabase((opt?.value as PlayerDB) ?? 'zadar')}
				options={databaseOptions}
			/>
		</Container>
	);
};

export default DatabaseFilter;
