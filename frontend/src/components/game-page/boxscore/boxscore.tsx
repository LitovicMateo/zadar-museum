import React from 'react';

import TableWrapper from '@/components/ui/table-wrapper';
import { usePlayerBoxscoreTable } from '@/hooks/usePlayerBoxscoreTable';
import { PlayerBoxscoreResponse } from '@/types/api/player';

type BoxscoreProps = {
	boxscore: PlayerBoxscoreResponse[];
};

const Boxscore: React.FC<BoxscoreProps> = ({ boxscore }) => {
	const { TableHead, TableBody } = usePlayerBoxscoreTable(boxscore);

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
		</TableWrapper>
	);
};

export default Boxscore;
