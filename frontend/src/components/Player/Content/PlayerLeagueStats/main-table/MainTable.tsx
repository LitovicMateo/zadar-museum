import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { TableSkeleton } from '@/components/UI/skeletons';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/UseAllTimeLeagueStats';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';
import { GameStatsEntry, PlayerCareerStats } from '@/types/api/Player';

import { LeagueCell, playerLeagueStatsColumns } from '../columns';

type MainTableProps = {
	view: 'total' | 'average';
	location: 'total' | 'home' | 'away' | 'neutral';
};

const MainTable: React.FC<MainTableProps> = ({ view, location }) => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: league, isLoading: isLoadingAverage } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const { data: career, isLoading: isLoadingTotal } = useAllTimeStats(playerId!, selectedDatabase);

	const groups = useMemo(
		() =>
			buildPhaseGroups<PlayerCareerStats, GameStatsEntry>(league, {
				combined: (e) => (view === 'average' ? e.average : e.total)[location],
				regular: (e) => e.regular?.[view][location] ?? null,
				playoff: (e) => e.playoff?.[view][location] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <LeagueCell leagueSlug={r.league_slug} />,
			}),
		[league, view, location],
	);

	const footerRows = useMemo<StatsDataRow<GameStatsEntry>[]>(() => {
		if (!career) return [];
		return career
			.map((entry, i) => {
				const group = view === 'average' ? entry.average : entry.total;
				const data = group[location] ?? group.total;
				return data ? { key: `career-${i}`, data } : null;
			})
			.filter((r): r is StatsDataRow<GameStatsEntry> => r != null);
	}, [career, view, location]);

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
		<StatsTable
			columns={playerLeagueStatsColumns}
			groups={groups}
			footer={{ rows: footerRows, variant: 'gradient' }}
		/>
	);
};

export default MainTable;
