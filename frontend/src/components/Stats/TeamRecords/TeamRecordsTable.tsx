import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { TeamRecord } from '@/types/api/TeamStats';
import { SortingState } from '@tanstack/react-table';

import NoContent from '../../NoContent/NoContent';
import AnimatedTableWrapper from '../../UI/AnimatedTableWrapper';
import { useTeamRecordsTable } from './UseTeamRecordsTable';

type TeamRecordsTableProps = {
	database: PlayerDB;
	data: TeamRecord[] | undefined;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

const TeamRecordsTable: React.FC<TeamRecordsTableProps> = ({ database, data, sorting, setSorting }) => {
	const { table } = useTeamRecordsTable(database, data, setSorting, sorting);

	if (!data || data.length === 0) {
		return <NoContent type="info" description={<p>There are no team stats in the database.</p>} />;
	}
	return (
		<AnimatedTableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</AnimatedTableWrapper>
	);
};

export default TeamRecordsTable;
