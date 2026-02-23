// boxscore/boxscore.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerBoxscore } from '@/hooks/queries/player/usePlayerBoxscore';
import { usePlayerGamelogTable } from '@/hooks/usePlayerGamelogTable';

const Boxscore: React.FC = () => {
	const { playerId } = useParams();
	const { season, selectedCompetitions } = useBoxscore();

	const { data, isLoading } = usePlayerBoxscore(playerId!, season);

	const filteredGames = React.useMemo(() => {
		if (!data) return [];
		const filtered = data.filter((g) => selectedCompetitions.includes(g.league_id));
		return filtered;
	}, [data, selectedCompetitions]);

	const { table } = usePlayerGamelogTable(filteredGames);

	if (isLoading) return null;

	if (filteredGames.length === 0) {
		return <div className="text-center w-full font-abel text-xl text-gray-400">No competitions selected.</div>;
	}

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default Boxscore;
