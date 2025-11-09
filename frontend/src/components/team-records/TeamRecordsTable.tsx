import React from 'react';

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
	const { TableBody, TableHead } = useTeamRecordsTable(database, data, setSorting, sorting);

	if (!data || data.length === 0) {
		return (
			<NoContent>
				<p>There are no team stats in the database.</p>
			</NoContent>
		);
	}
	return (
		<div className="w-full overflow-x-scroll">
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</div>
	);
};

export default TeamRecordsTable;
