import React from 'react';
import Select from 'react-select';

import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import { selectStyle } from '@/constants/ReactSelectStyle';
import Category from '@/pages/Stats/Category';
import Container from '@/pages/Stats/Container';

type DatabaseFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;
};

const databaseOptions: { label: string; value: PlayerDB }[] = [
	{ label: 'Zadar', value: 'zadar' },
	{ label: 'Opponents', value: 'opponent' }
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
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default DatabaseFilter;
