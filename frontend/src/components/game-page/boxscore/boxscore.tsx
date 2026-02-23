import React from 'react';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { usePlayerBoxscoreTable } from '@/hooks/usePlayerBoxscoreTable';
import { PlayerBoxscoreResponse } from '@/types/api/player';

type BoxscoreProps = {
	boxscore: PlayerBoxscoreResponse[];
};

const Boxscore: React.FC<BoxscoreProps> = ({ boxscore }) => {
	const { table } = usePlayerBoxscoreTable(boxscore);

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default Boxscore;
