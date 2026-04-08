// boxscore/boxscore.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/UI/TableWrapper';
import { TableSkeleton } from '@/components/UI/skeletons';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { usePlayerGamelogTable } from '@/hooks/UsePlayerGamelogTable';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerBoxscore } from '@/hooks/queries/player/UsePlayerBoxscore';

import styles from './Boxscore.module.css';

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

	if (isLoading) return <TableSkeleton rows={5} columns={8} />;

	if (filteredGames.length === 0) {
		return <div className={styles.emptyState}>No competitions selected.</div>;
	}

	return (
		<TableWrapper noOverflow>
			<UniversalTableHead table={table} stickyTop />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default Boxscore;
