import React from 'react';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';
import { SortingState } from '@tanstack/react-table';

import NoContent from '../no-content/no-content';
import TableWrapper from '../ui/table-wrapper';
import { useTeamRecordsTable } from './useTeamRecordsTable';

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
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default TeamRecordsTable;
