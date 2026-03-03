// boxscore/boxscore.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { TableSkeleton } from '@/components/ui/skeletons';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerBoxscore } from '@/hooks/queries/player/usePlayerBoxscore';
import { usePlayerGamelogTable } from '@/hooks/usePlayerGamelogTable';

import styles from './boxscore.module.css';

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
