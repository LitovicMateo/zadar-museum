import React from 'react';

import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { usePlayerBoxscoreTable } from '@/hooks/UsePlayerBoxscoreTable';
import { PlayerBoxscoreResponse } from '@/types/api/Player';

type BoxscoreProps = {
	boxscore: PlayerBoxscoreResponse[];
};

const Boxscore: React.FC<BoxscoreProps> = ({ boxscore }) => {
	const { table } = usePlayerBoxscoreTable(boxscore);

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody
				table={table}
				rowVariant={(row) => (row.original.status === 'starter' ? 'trStarter' : undefined)}
			/>
		</TableWrapper>
	);
};

export default Boxscore;
