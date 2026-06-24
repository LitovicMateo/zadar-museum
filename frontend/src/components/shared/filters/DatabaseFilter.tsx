import React from 'react';
import Select from 'react-select';

import { PlayerDB } from '@/components/Player/PlayerPage';
import Category from '@/components/Stats/Category';
import Container from '@/components/Stats/Container';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';

type DatabaseFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;
};

const DatabaseFilter: React.FC<DatabaseFilterProps> = ({ database, setDatabase }) => {
	const { data: mainTeam } = useMainTeam();

	const databaseOptions: { label: string; value: PlayerDB }[] = [
		{ label: mainTeam?.name ?? 'Main', value: 'main' },
		{ label: 'Opponents', value: 'opponent' }
	];

	return (
		<Container>
			<Category>Database</Category>
			<Select
				styles={selectStyle()}
				value={databaseOptions.find((opt) => opt.value === database)}
				onChange={(opt) => setDatabase((opt?.value as PlayerDB) ?? 'main')}
				options={databaseOptions}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default DatabaseFilter;
