import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import FilterField from '@/components/Stats/UI/FilterField';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';

type DatabaseFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;
};

const DatabaseFilter: React.FC<DatabaseFilterProps> = ({ database, setDatabase }) => {
	const { data: mainTeam } = useMainTeam();

	const options: { value: PlayerDB; label: string }[] = [
		{ value: 'main', label: mainTeam?.name ?? 'Main' },
		{ value: 'opponent', label: 'Opponents' }
	];

	return (
		<FilterField>
			<SegmentedToggle
				value={database}
				onValueChange={setDatabase}
				options={options}
				ariaLabel="Database filter"
			/>
		</FilterField>
	);
};

export default DatabaseFilter;
