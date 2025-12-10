import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/useAllTimeLeagueStats';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { usePlayerLeagueStatsTable } from '@/hooks/usePlayerLeagueStatsTable';

type MainTableProps = {
	view: 'total' | 'average';
};

const MainTable: React.FC<MainTableProps> = ({ view }) => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: league, isLoading: isLoadingAverage } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const { data: career, isLoading: isLoadingTotal } = useAllTimeStats(playerId!, selectedDatabase);

	const leagueStats = useMemo(() => {
		if (!league) return [];
		return league.map((league) => (view === 'average' ? league.average.total : league.total.total));
	}, [league, view]);

	const careerStats = useMemo(() => {
		if (!career) return [];
		return career.map((league) => (view === 'average' ? league.average.total : league.total.total));
	}, [career, view]);

	const { TableHead, TableBody } = usePlayerLeagueStatsTable(leagueStats);
	const { TableFooter } = usePlayerLeagueStatsTable(careerStats);

	const wrapperClass =
		'max-w-[800px] mx-auto overflow-x-auto rounded-lg m-4 drop-shadow-2xl bg-linear-to-br from-white to-slate-100';

	if (isLoadingAverage || isLoadingTotal) {
		return (
			<div className={wrapperClass}>
				<div className="p-2">
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
			<TableFooter />
		</TableWrapper>
	);
};

export default MainTable;
