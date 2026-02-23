import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TableSkeleton } from '@/components/ui/skeletons';
import TableWrapper from '@/components/ui/table-wrapper';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/useAllTimeLeagueStats';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { usePlayerLeagueStatsTable } from '@/hooks/usePlayerLeagueStatsTable';

type MainTableProps = {
	view: 'total' | 'average';
	location: 'total' | 'home' | 'away' | 'neutral';
};

const MainTable: React.FC<MainTableProps> = ({ view, location }) => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: league, isLoading: isLoadingAverage } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const { data: career, isLoading: isLoadingTotal } = useAllTimeStats(playerId!, selectedDatabase);

	const leagueStats = useMemo(() => {
		if (!league) return [];
		return league.map((league) => {
			const group = view === 'average' ? league.average : league.total;
			return group[location] ?? group.total;
		});
	}, [league, view, location]);

	const careerStats = useMemo(() => {
		if (!career) return [];
		return career.map((league) => {
			const group = view === 'average' ? league.average : league.total;
			return group[location] ?? group.total;
		});
	}, [career, view, location]);

	const { TableHead, TableBody } = usePlayerLeagueStatsTable(leagueStats);
	const { TableFooter } = usePlayerLeagueStatsTable(careerStats);

	const wrapperClass =
		'max-w-[800px] mx-auto overflow-x-auto rounded-lg m-4 drop-shadow-2xl bg-linear-to-br from-white to-slate-100';

	if (isLoadingAverage || isLoadingTotal) {
		return (
			<div className={wrapperClass}>
				<TableSkeleton rows={5} columns={8} />
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
