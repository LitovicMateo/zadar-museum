import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { StatCardSkeleton } from '@/components/ui/skeletons';
import StatCard from '@/components/ui/stat-card';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';

const statsConfig = [
	{ label: 'Games', key: 'games' as const, rankKey: 'games_rank' as const },
	{ label: 'Points', key: 'points' as const, rankKey: 'points_rank' as const },
	{ label: 'Rebounds', key: 'rebounds' as const, rankKey: 'rebounds_rank' as const },
	{ label: 'Assists', key: 'assists' as const, rankKey: 'assists_rank' as const },
	{ label: '3PT', key: 'three_pointers_made' as const, rankKey: 'three_pointers_made_rank' as const },
	{ label: 'FT', key: 'free_throws_made' as const, rankKey: 'free_throws_made_rank' as const }
];

const AllTimeStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data, isLoading } = useAllTimeStats(playerId!, selectedDatabase!);

	if (isLoading || !data) {
		return (
			<section className="flex flex-col gap-4">
				<Heading title="All Time Stats" />
				<div className="rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white">
					<div className="flex justify-between px-4 py-3 font-semibold bg-slate-100 text-lg border-b-2 border-blue-500">
						<span className="text-gray-700">Statistic</span>
						<span className="text-gray-700">Record (Rank)</span>
					</div>
					{Array.from({ length: 6 }).map((_, i) => (
						<StatCardSkeleton key={i} />
					))}
				</div>
			</section>
		);
	}

	const totalStats = data[0].total.total;

	return (
		<section className="flex flex-col gap-4" aria-labelledby="all-time-stats-heading">
			<Heading title="All Time Stats" id="all-time-stats-heading" />
			<div
				className="rounded-lg shadow-md border border-gray-200 overflow-hidden bg-white"
				role="table"
				aria-label="Career statistics"
			>
				<div
					className="flex justify-between px-4 py-3 font-semibold bg-gradient-to-r from-slate-100 to-slate-50 text-lg border-b-2 border-blue-500 min-w-[280px]"
					role="row"
				>
					<span role="columnheader" className="text-gray-700">
						Statistic
					</span>
					<span role="columnheader" className="text-gray-700">
						Record (Rank)
					</span>
				</div>
				{statsConfig.map((stat) => (
					<div key={stat.key} role="row">
						<StatCard label={stat.label} value={totalStats[stat.key]} rank={totalStats[stat.rankKey]} />
					</div>
				))}
			</div>
		</section>
	);
});

AllTimeStats.displayName = 'AllTimeStats';

export default AllTimeStats;
